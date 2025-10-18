import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getUserCountByRole, getUserCountByVerification } from '@/lib/db/queries/user';
import { getWithdrawalStats } from '@/lib/db/queries/withdrawal';
import { getPaymentStats } from '@/lib/db/queries/payment';
import { getReportStats } from '@/lib/db/queries/report';
import { getOfferStats } from '@/lib/db/queries/offer';
import { getPromoCodeStats } from '@/lib/db/queries/promo-code';
import { getMediaStats } from '@/lib/db/queries/media';
import { getAuditLogStats } from '@/lib/db/queries/audit-log';
import { getNotificationStats } from '@/lib/db/queries/notification';
import { getConversationStats } from '@/lib/db/queries/conversation';
import { prisma } from '@/lib/db/prisma';

/**
 * Get admin statistics
 * @description Retrieve comprehensive statistics for admin dashboard
 * @response 200:AdminStatsResponse:Admin statistics retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    // Get all statistics in parallel
    const [
      userCounts,
      userVerificationCounts,
      withdrawalStats,
      paymentStats,
      reportStats,
      offerStats,
      promoCodeStats,
      mediaStats,
      auditLogStats,
      notificationStats,
      conversationStats,
      recentUsers,
      recentTransactions,
      recentWithdrawals,
      recentReports,
    ] = await Promise.all([
      getUserCountByRole(),
      getUserCountByVerification(),
      getWithdrawalStats(),
      getPaymentStats(),
      getReportStats(),
      getOfferStats(),
      getPromoCodeStats(),
      getMediaStats(),
      getAuditLogStats(),
      getNotificationStats(),
      getConversationStats(),
      prisma.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.serviceTransaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          priceAgreed: true,
          status: true,
          createdAt: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          professional: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.withdrawal.findMany({
        orderBy: { requestedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          amount: true,
          status: true,
          requestedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          reason: true,
          status: true,
          createdAt: true,
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Calculate additional metrics
    const totalRevenue = paymentStats.completedAmount;
    const pendingWithdrawals = withdrawalStats.pendingAmount;
    const activeUsers = userCounts.clients + userCounts.professionals;
    const systemHealth = 'OK'; // This could be calculated based on various factors

    // Prepare response data
    const statsData = {
      overview: {
        totalUsers: userCounts.clients + userCounts.professionals + userCounts.admins,
        activeUsers,
        totalRevenue,
        pendingWithdrawals,
        systemHealth,
      },
      users: {
        total: userCounts.clients + userCounts.professionals + userCounts.admins,
        clients: userCounts.clients,
        professionals: userCounts.professionals,
        admins: userCounts.admins,
        verified: userVerificationCounts.verified,
        unverified: userVerificationCounts.unverified,
      },
      financial: {
        totalRevenue,
        totalPayments: paymentStats.total,
        completedPayments: paymentStats.completed,
        totalWithdrawals: withdrawalStats.total,
        pendingWithdrawals: withdrawalStats.pending,
        completedWithdrawals: withdrawalStats.completed,
      },
      content: {
        totalReports: reportStats.total,
        pendingReports: reportStats.pending,
        resolvedReports: reportStats.resolved,
        totalOffers: offerStats.total,
        pendingOffers: offerStats.pending,
        acceptedOffers: offerStats.accepted,
        totalMedia: mediaStats.total,
        totalPromoCodes: promoCodeStats.total,
        activePromoCodes: promoCodeStats.active,
      },
      activity: {
        totalNotifications: notificationStats.total,
        unreadNotifications: notificationStats.unread,
        totalConversations: conversationStats.total,
        totalMessages: conversationStats.totalMessages,
        recentActivity: auditLogStats.recentActivity,
      },
      recent: {
        users: recentUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        })),
        transactions: recentTransactions.map(transaction => ({
          id: transaction.id,
          amount: transaction.priceAgreed.toNumber(),
          status: transaction.status,
          createdAt: transaction.createdAt.toISOString(),
          client: transaction.client,
          professional: transaction.professional,
        })),
        withdrawals: recentWithdrawals.map(withdrawal => ({
          id: withdrawal.id,
          amount: withdrawal.amount.toNumber(),
          status: withdrawal.status,
          requestedAt: withdrawal.requestedAt.toISOString(),
          user: withdrawal.user,
        })),
        reports: recentReports.map(report => ({
          id: report.id,
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt.toISOString(),
          reporter: report.reporter,
        })),
      },
    };

    return NextResponse.json(
      createSuccessResponse(statsData, 'Admin statistics retrieved successfully')
    );

  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve admin statistics'
      ),
      { status: 500 }
    );
  }
}
