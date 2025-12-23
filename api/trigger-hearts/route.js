// app/api/trigger-hearts/route.js
import Pusher from 'pusher';
import { NextResponse } from 'next/server';

// Initialize Pusher on the server side with secret keys
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST() {
  try {
    // Trigger an event called 'hearts-triggered' on the 'anniversary-channel'
    await pusher.trigger('anniversary-channel', 'hearts-triggered', {
      message: 'Love sent!',
    });
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}