import React from 'react';
import { Calendar, MapPin, Video } from 'lucide-react';

interface TicketDesignProps {
    event: any;
    attendeeName: string;
    ticketId: string;
}

export const TicketDesign = React.forwardRef<HTMLDivElement, TicketDesignProps>(({ event, attendeeName, ticketId }, ref) => {
    const dateObj = new Date(event.startDate ?? event.date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

    // Light professional color palette
    const primaryGreen = '#5bdc8a';
    const darkText = '#1e293b';
    const lightGray = '#f8fafc';
    const mediumGray = '#94a3b8';
    const borderColor = '#e2e8f0';
    const purple = '#8b5cf6';

    return (
        <div
            ref={ref}
            className="font-sans"
            style={{
                position: 'fixed',
                left: '-9999px',
                top: '-9999px',
                width: '1000px',
                backgroundColor: '#ffffff',
                padding: '40px',
                colorScheme: 'light',
                color: darkText
            }}
        >
            {/* --- FLIGHT TICKET STYLE --- */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '920px',
                    minHeight: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: `1px solid ${borderColor}`
                }}
            >
                {/* === LEFT SECTION: Event Details === */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        padding: '28px 32px'
                    }}
                >
                    {/* Header Row: Logo, Date Badge & Ticket Type */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                        paddingBottom: '16px',
                        borderBottom: `1px solid ${borderColor}`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <img
                                src="/images/logo.png"
                                alt="GrowthYari Logo"
                                style={{
                                    height: '36px',
                                    width: 'auto',
                                    display: 'block'
                                }}
                            />
                            {/* Date Badge */}
                            <div style={{
                                backgroundColor: lightGray,
                                borderRadius: '12px',
                                padding: '8px 16px',
                                textAlign: 'center',
                                border: `1px solid ${borderColor}`
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkText, lineHeight: '1', paddingBottom: '3px' }}>{day}</div>
                                <div style={{ fontSize: '11px', fontWeight: '600', color: primaryGreen, letterSpacing: '0.08em', paddingLeft: '3px' }}>{month}</div>
                            </div>
                        </div>
                        <div className={`bg-[#daccfc] px-3 pb-[10px] rounded-[20px] text-xs font-semibold text-${darkText}`}>
                            {event.mode === "ONLINE" ? "Online Event" : "Live Event"}
                        </div>
                    </div>

                    {/* Event Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: darkText,
                            margin: 0,
                            lineHeight: '1.2'
                        }}>
                            {event.title}
                        </h2>
                    </div>

                    {/* Info Grid - Flight Ticket Style */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        marginBottom: '24px'
                    }}>
                        {/* Date */}
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: mediumGray, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Date</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: darkText }}>{day} {month} {year}</div>
                            <div style={{ fontSize: '12px', color: mediumGray, marginTop: '2px' }}>{weekday}</div>
                        </div>

                        {/* Time */}
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: mediumGray, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Time</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: darkText }}>{time}</div>
                            <div style={{ fontSize: '12px', color: mediumGray, marginTop: '2px' }}>Start Time</div>
                        </div>

                        {/* Venue */}
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: mediumGray, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Venue</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {/* {event.mode === "ONLINE" ? (
                                    <Video style={{ height: '16px', width: '16px', color: primaryGreen, flexShrink: 0, }} />
                                ) : (
                                    <MapPin style={{ height: '16px', width: '16px', color: primaryGreen, flexShrink: 0, marginTop: '4px' }} />
                                )} */}
                                <span style={{ fontSize: '14px', fontWeight: '600', color: darkText, lineHeight: '1' }}>
                                    {event.mode === "ONLINE" ? "Online" : (event.location?.split(',')[0] || "TBA")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Attendee Section */}
                    <div style={{
                        marginTop: 'auto',
                        paddingTop: '20px',
                        borderTop: `1px dashed ${borderColor}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: '600', color: mediumGray, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Attendee Name</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: darkText }}>{attendeeName}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: '600', color: mediumGray, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Ticket ID</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: primaryGreen, fontFamily: 'monospace' }}>#{ticketId}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '11px', color: mediumGray }}>www.GrowthYari.com</div>
                    </div>
                </div>

                {/* === DOTTED LINE DIVIDER === */}
                <div style={{
                    width: '1px',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    zIndex: 10
                }}>
                    {/* Top semi-circle cutout */}
                    <div style={{
                        position: 'absolute',
                        top: '-16px',
                        left: '-15px',
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        border: `1px solid ${borderColor}`,
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.05)'
                    }} />

                    {/* Dotted/Dashed line */}
                    <div style={{
                        position: 'absolute',
                        top: '14px',
                        bottom: '14px',
                        left: '-1px',
                        width: '0',
                        borderLeft: `2px dashed ${borderColor}`
                    }} />

                    {/* Bottom semi-circle cutout */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-16px',
                        left: '-15px',
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        border: `1px solid ${borderColor}`,
                        borderBottom: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                    }} />
                </div>

                {/* === RIGHT SECTION: Event Image Only === */}
                <div
                    style={{
                        width: '320px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: lightGray,
                        padding: '16px'
                    }}
                >
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt=""
                            crossOrigin="anonymous"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                borderRadius: '12px'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '260px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: `2px dashed ${borderColor}`
                        }}>
                            <Calendar style={{ height: '72px', width: '72px', color: borderColor }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

TicketDesign.displayName = "TicketDesign";
