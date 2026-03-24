-- Admin Dashboard Migration

-- Add role and suspended columns to User
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'HOST';
ALTER TABLE "User" ADD COLUMN "suspended" BOOLEAN NOT NULL DEFAULT false;

-- Add status column to Quiz
ALTER TABLE "Quiz" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'APPROVED';

-- QuizSession table
CREATE TABLE "QuizSession" (
    "id" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "terminated" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "QuizSession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "QuizSession_inviteCode_key" ON "QuizSession"("inviteCode");
ALTER TABLE "QuizSession" ADD CONSTRAINT "QuizSession_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuizSession" ADD CONSTRAINT "QuizSession_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- PlayerSession table
CREATE TABLE "PlayerSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerSession_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "PlayerSession" ADD CONSTRAINT "PlayerSession_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PlayerAnswer table
CREATE TABLE "PlayerAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "playerSessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "points" INTEGER NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerAnswer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "PlayerAnswer" ADD CONSTRAINT "PlayerAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerAnswer" ADD CONSTRAINT "PlayerAnswer_playerSessionId_fkey" FOREIGN KEY ("playerSessionId") REFERENCES "PlayerSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerAnswer" ADD CONSTRAINT "PlayerAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Report table
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Report" ADD CONSTRAINT "Report_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Announcement table
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- PlatformSetting table
CREATE TABLE "PlatformSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("key")
);
