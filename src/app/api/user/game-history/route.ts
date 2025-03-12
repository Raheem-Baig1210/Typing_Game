import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Add export for dynamic route handling
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { gameMode, wpm, accuracy, textLength, duration } = await req.json();

    // Validate input
    if (!gameMode || typeof wpm !== 'number' || typeof accuracy !== 'number' || 
        typeof textLength !== 'number' || typeof duration !== 'number') {
      return NextResponse.json(
        { error: "Invalid game data" },
        { status: 400 }
      );
    }

    // Get user's current typing stats
    const userStats = await prisma.typingStats.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!userStats) {
      return NextResponse.json(
        { error: "User stats not found" },
        { status: 404 }
      );
    }

    // Create game history entry
    const gameHistory = await prisma.gameHistory.create({
      data: {
        userId: session.user.id,
        gameMode,
        wpm,
        accuracy,
        textLength,
        duration,
      },
    });

    // Update user stats
    const updatedStats = await prisma.typingStats.update({
      where: {
        userId: session.user.id,
      },
      data: {
        highestWpm: Math.max(userStats.highestWpm, wpm),
        averageWpm: Math.round(
          (userStats.averageWpm * userStats.gamesPlayed + wpm) / (userStats.gamesPlayed + 1)
        ),
        gamesPlayed: userStats.gamesPlayed + 1,
        totalTimePlayed: userStats.totalTimePlayed + duration,
        lastPlayed: new Date(),
      },
    });

    return NextResponse.json({
      message: "Game results saved successfully",
      gameHistory,
      updatedStats,
    });
  } catch (error) {
    console.error("Error saving game results:", error);
    return NextResponse.json(
      { error: "An error occurred while saving game results" },
      { status: 500 }
    );
  }
} 