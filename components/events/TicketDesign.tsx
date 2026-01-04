import React from 'react';
import { Calendar, MapPin, Video, Clock } from 'lucide-react';

interface TicketDesignProps {
    event: any;
    attendeeName: string;
    ticketId: string;
}

export const TicketDesign = React.forwardRef<HTMLDivElement, TicketDesignProps>(({ event, attendeeName, ticketId }, ref) => {
    const dateObj = new Date(event.startDate ?? event.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            ref={ref}
            className="font-sans"
            style={{
                position: 'fixed',
                left: '-9999px',
                top: '-9999px',
                width: '1100px', // Wider to better fill A4 Landscape
                backgroundColor: '#ffffff',
                padding: '40px',
                colorScheme: 'light',
                color: '#0f172a'
            }}
        >
            {/* --- DASHED BORDER CONTAINER --- */}
            <div
                style={{
                    border: '2px dotted #cbd5e1',
                    borderRadius: '40px',
                    padding: '28px',
                    backgroundColor: '#ffffff'
                }}
            >
                {/* --- TOP SECTION: ATTENDEE INFO --- */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '24px 32px',
                        borderBottom: '2px dashed #f1f5f9',
                        marginBottom: '24px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '32px 32px 12px 12px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img
                            src="/images/logo.png"
                            alt="GrowthYari Logo"
                            style={{
                                height: '56px',
                                width: 'auto',
                                display: 'block'
                            }}
                        />
                        <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.12em', color: '#64748b', display: 'block' }}>Official Ticket For</span>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{attendeeName}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.12em', color: '#64748b', display: 'block' }}>Ticket ID</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', fontFamily: 'monospace' }}>#{ticketId}</span>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: EVENT CARD --- */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', padding: '16px' }}>

                    {/* Left Content Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px' }}>

                        {/* Date & Time Row - REFINED ALIGNMENT */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '16px',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #f1f5f9',
                                    padding: '10px 18px',
                                    minWidth: '75px'
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>{month}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{day}</span>
                                </div>
                                <div style={{ height: '40px', width: '1.5px', backgroundColor: '#e2e8f0' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#475569' }}>{time}</span>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                padding: '2px 20px 15px 20px',
                                borderRadius: '16px',
                                fontSize: '13px',
                                fontWeight: '600',
                                textAlign: 'center',
                                minWidth: '110px',
                                display: 'block',
                                lineHeight: '1.2'
                            }}>
                                Upcoming
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '38px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px', lineHeight: '1.2' }}>
                                {event.title}
                            </h3>
                            <p style={{
                                fontSize: '18px',
                                color: '#444444',
                                lineHeight: '1.5',
                                maxWidth: '560px',
                                margin: '0'
                            }}>
                                {event.description}
                            </p>
                        </div>

                        {/* Footer Metadata */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '28px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                <div style={{ flex: '1.6', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.08em' }}>Location</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {event.mode === "ONLINE" ? <Video style={{ height: '20px', width: '20px', color: '#059669' }} /> : <MapPin style={{ height: '20px', width: '20px', color: '#059669' }} />}
                                        <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#1e293b' }}>
                                            {event.mode === "ONLINE" ? "Online Stream" : event.location || "TBA"}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ flex: '1', borderLeft: '1.5px solid #f1f5f9', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.08em' }}>Entry Fee</span>
                                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: event.isFree ? '#059669' : '#0f172a' }}>
                                        {event.isFree ? "FREE" : "Paid"}
                                    </div>
                                </div>

                                <div style={{ flex: '1', borderLeft: '1.5px solid #f1f5f9', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                                    <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.08em' }}>Verification</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '12px', display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.12em' }}>Verified</span>
                                            <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Identity Confirmed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image Segment - REFINED ALIGNMENT */}
                    <div style={{ position: 'relative', width: '420px', borderRadius: '32px', overflow: 'hidden', backgroundColor: '#f8fafc', alignSelf: 'stretch' }}>
                        {event.imageUrl ? (
                            <img
                                src={event.imageUrl}
                                alt=""
                                crossOrigin="anonymous"
                                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar style={{ height: '80px', width: '80px', color: '#e2e8f0' }} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
});

TicketDesign.displayName = "TicketDesign";
