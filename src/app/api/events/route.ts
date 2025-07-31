import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse form data
        const formData = await request.formData();
        
        // Extract data from form
        const eventData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            location: formData.get('location') as string,
            statusEvent: formData.get('statusEvent') as string,
            category: formData.get('category') as string,
            organizerId: formData.get('organizerId') as string,
            syaratKetentuan: formData.get('syaratKetentuan') as string,
            ticketTypes: formData.get('ticketTypes') as string,
            image: formData.get('image') as File | null,
        };

        // Log received data for debugging
        console.log('Received event data:', {
            ...eventData,
            image: eventData.image ? `File: ${eventData.image.name} (${eventData.image.size} bytes)` : 'No image'
        });

        // Parse ticket types
        let tickets = [];
        try {
            tickets = eventData.ticketTypes ? JSON.parse(eventData.ticketTypes) : [];
        } catch (error) {
            console.error('Error parsing ticket types:', error);
        }

        // Validate required fields
        if (!eventData.name || !eventData.description || !eventData.location || 
            !eventData.startDate || !eventData.endDate) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate dates
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);
        
        if (startDate >= endDate) {
            return NextResponse.json(
                { success: false, message: "End date must be after start date" },
                { status: 400 }
            );
        }

        // Here you would typically save to database
        // For now, we'll just return success
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Event created successfully",
            data: {
                id: Math.floor(Math.random() * 1000) + 1,
                ...eventData,
                tickets: tickets,
                createdAt: new Date().toISOString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Handle GET request to fetch events
export async function GET() {
    try {
        // This would typically fetch from database
        // For now, return mock data
        return NextResponse.json({
            success: true,
            message: "Events fetched successfully",
            data: []
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
