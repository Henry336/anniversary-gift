import Pusher from 'pusher';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    await pusher.trigger('anniversary-channel', 'hearts-triggered', {
      message: 'Love sent!',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}