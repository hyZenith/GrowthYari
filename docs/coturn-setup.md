# Coturn TURN Server Setup Guide

## Overview

This guide explains how to set up a Coturn TURN server for production WebRTC connectivity in YariConnect. TURN servers are essential for establishing WebRTC connections across restrictive networks and NATs.

## Why TURN is Needed

- **STUN servers** help discover public IP addresses but don't work through symmetric NATs
- **TURN servers** relay traffic when direct peer-to-peer connection fails
- Required for ~15-20% of WebRTC connections that can't establish direct connections
- Critical for enterprise networks with strict firewall rules

---

## Prerequisites

- Ubuntu/Debian server (t2.micro or larger on AWS/DigitalOcean)
- Public IP address
- Open firewall ports (see below)
- Domain name (optional but recommended for SSL)
- Root or sudo access

---

## Installation

### 1. Install Coturn

```bash
# Update package list
sudo apt update

# Install Coturn
sudo apt install coturn -y

# Enable Coturn as a system service
sudo systemctl enable coturn
```

### 2. Configure Firewall

Open the following ports:

```bash
# STUN/TURN (UDP and TCP)
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp

# TURN relay ports (UDP)
sudo ufw allow 49152:65535/udp

# Enable firewall if not already enabled
sudo ufw enable
```

**AWS/Cloud specific**: Also add these rules to your Security Group/Firewall settings in your cloud provider's console.

---

## Configuration

### 3. Edit Coturn Configuration

Edit the main configuration file:

```bash
sudo nano /etc/turnserver.conf
```

**Recommended configuration**:

```conf
# Listening port
listening-port=3478

# External IP (replace with your server's public IP)
external-ip=YOUR_PUBLIC_IP

# Relay IP (usually same as external IP)
relay-ip=YOUR_PUBLIC_IP

# Realm (your domain or app name)
realm=growthyari.com

# Server name
server-name=growthyari.com

# Authentication
# Use long-term credentials with a shared secret
use-auth-secret
static-auth-secret=YOUR_SUPER_SECRET_KEY_HERE

# Security settings
fingerprint
lt-cred-mech

# Logging
log-file=/var/log/turnserver.log
verbose

# Performance
no-multicast-peers
no-cli

# Relay addresses (adjust based on your network)
min-port=49152
max-port=65535

# Total quota (limit bandwidth per user)
user-quota=12
total-quota=1200
```

### 4. Generate Shared Secret

Generate a strong shared secret:

```bash
openssl rand -hex 32
```

Copy the output and replace `YOUR_SUPER_SECRET_KEY_HERE` in the config above.

---

## SSL/TLS Configuration (Recommended)

### 5. Get SSL Certificate

Using Let's Encrypt:

```bash
sudo apt install certbot -y

# Get certificate (replace with your domain)
sudo certbot certonly --standalone -d turn.growthyari.com
```

### 6. Update Coturn for TLS

Add to `/etc/turnserver.conf`:

```conf
# TLS configuration
tls-listening-port=5349
cert=/etc/letsencrypt/live/turn.growthyari.com/fullchain.pem
pkey=/etc/letsencrypt/live/turn.growthyari.com/privkey.pem
```

**Note**: You'll also need to open port 5349 in your firewall:

```bash
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp
```

---

## Starting Coturn

### 7. Enable and Start Service

```bash
# Enable Coturn daemon
sudo nano /etc/default/coturn
# Uncomment the line: TURNSERVER_ENABLED=1

# Start Coturn
sudo systemctl start coturn

# Check status
sudo systemctl status coturn

# View logs
sudo tail -f /var/log/turnserver.log
```

---

## Testing TURN Server

### 8. Test Connectivity

Use the Trickle ICE test tool: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

**Configuration to test**:
- **STUN URL**: `stun:YOUR_PUBLIC_IP:3478`
- **TURN URL**: `turn:YOUR_PUBLIC_IP:3478`
- **Username**: (generate using your app's logic)
- **Password**: (generate using your app's logic)

Click "Gather candidates" - you should see `relay` type candidates if TURN is working.

---

## Integration with YariConnect

### 9. Environment Variables

Add to your `.env` file:

```bash
# TURN Server Configuration
TURN_SERVER_URL=turn:YOUR_PUBLIC_IP:3478
TURN_SECRET=YOUR_SUPER_SECRET_KEY_HERE
TURN_USERNAME=growthyari
```

### 10. Credential Generation

The realtime server automatically generates time-limited credentials using the shared secret. The implementation is in `lib/turn-credentials.ts`.

**How it works**:
1. Client initiates call
2. Server generates temporary username: `timestamp:userId`
3. Server creates HMAC-SHA1 hash of username using shared secret
4. Credentials are sent to client via Socket.IO
5. Credentials expire after 24 hours

---

## Security Best Practices

1. **Use strong shared secret**: At least 32 characters, use `openssl rand -hex 32`
2. **Enable SSL/TLS**: Use `turns://` URLs in production
3. **Rate limiting**: Already implemented in Socket.IO server
4. **Restrict relay addresses**: Only allow necessary IP ranges
5. **Monitor bandwidth**: TURN can consume significant bandwidth, set quotas
6. **Firewall rules**: Only open necessary ports
7. **Regular updates**: Keep Coturn updated for security patches

---

## Monitoring and Maintenance

### Check Coturn Status

```bash
sudo systemctl status coturn
```

### View Active Sessions

```bash
sudo turnadmin -l
```

### View Logs

```bash
sudo tail -f /var/log/turnserver.log
```

### Restart After Config Changes

```bash
sudo systemctl restart coturn
```

---

## Troubleshooting

### Coturn won't start

- Check configuration syntax: `turnadmin -c /etc/turnserver.conf`
- Verify ports aren't already in use: `sudo netstat -tulpn | grep 3478`
- Check logs: `sudo journalctl -u coturn -n 50`

### Clients can't connect

- Verify firewall rules (both server and cloud provider)
- Check external-ip is set correctly
- Test with Trickle ICE tool
- Verify shared secret matches between server and app

### High bandwidth usage

- Reduce user-quota and total-quota in config
- Monitor with: `sudo turnadmin -S`
- Consider implementing usage limits in your app

---

## Cost Estimation

**Bandwidth considerations**:
- Video call uses ~2-4 Mbps per user
- TURN relays 100% of traffic (unlike STUN)
- Estimate: 10 concurrent calls = 40 Mbps = ~20 GB/hour
- AWS data transfer: ~$0.09/GB after free tier

**Recommended**:
- Start with t2.micro ($10/month)
- Monitor bandwidth usage
- Scale up if needed

---

## Alternative: Managed TURN Services

If managing your own TURN server is complex, consider:
- **Twilio TURN** (formerly Xirsys)
- **Metered.ca**
- **Cloudflare Calls** (Beta)

These services handle scaling and maintenance but have per-minute costs.

---

## Summary

You now have a production-ready TURN server that:
- ✅ Relays WebRTC traffic through restrictive networks
- ✅ Uses time-limited credentials for security
- ✅ Supports SSL/TLS encryption
- ✅ Integrates seamlessly with YariConnect

For development, continue using Google STUN servers. Deploy TURN for production.
