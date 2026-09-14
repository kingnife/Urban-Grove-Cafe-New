import React, { useState } from 'react';
import { 
  Award, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  TrendingUp, 
  Coffee, 
  ShoppingBag, 
  Calendar, 
  Star, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Zap, 
  Check, 
  Copy,
  ChevronRight,
  Info
} from 'lucide-react';
import { CustomerUser, LoyaltyTier, LoyaltyTransaction } from '../types';
import { LOYALTY_TIERS, INITIAL_POINTS_HISTORY } from '../data/initialData';

interface LoyaltyRewardsSectionProps {
  user: CustomerUser;
  onRedeemReward: (rewardTitle: string, pointCost: number) => Promise<void>;
  redeemedNotice: string | null;
}

export const LoyaltyRewardsSection: React.FC<LoyaltyRewardsSectionProps> = ({
  user,
  onRedeemReward,
  redeemedNotice
}) => {
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<'all' | 'earned' | 'redeemed'>('all');
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const currentPoints = user.loyaltyPoints ?? 0;

  // Determine current tier from LOYALTY_TIERS
  const currentTier = LOYALTY_TIERS.find(
    (t) => currentPoints >= t.minPoints && currentPoints <= t.maxPoints
  ) || (currentPoints >= 1000 ? LOYALTY_TIERS[LOYALTY_TIERS.length - 1] : LOYALTY_TIERS[0]);

  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.id === currentTier.id);
  const nextTier: LoyaltyTier | null = 
    currentTierIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentTierIndex + 1] : null;

  // Calculate points needed and progress towards the next tier
  const pointsToNextTier = nextTier ? Math.max(0, nextTier.minPoints - currentPoints) : 0;
  
  // Progress within the current tier segment
  const tierMin = currentTier.minPoints;
  const tierTarget = nextTier ? nextTier.minPoints : currentTier.maxPoints;
  const tierProgressPercent = nextTier 
    ? Math.min(100, Math.max(0, Math.round(((currentPoints - tierMin) / (tierTarget - tierMin)) * 100)))
    : 100;

  // Overall milestone progress relative to 1000 pts
  const overallMilestonePercent = Math.min(100, Math.max(0, Math.round((currentPoints / 1000) * 100)));

  // Points history records
  const rawHistory: LoyaltyTransaction[] = 
    user.pointsHistory && user.pointsHistory.length > 0 
      ? user.pointsHistory 
      : INITIAL_POINTS_HISTORY;

  const totalPointsEarned = rawHistory
    .filter((tx) => tx.points > 0)
    .reduce((sum, tx) => sum + tx.points, 0);

  const totalPointsRedeemed = Math.abs(
    rawHistory
      .filter((tx) => tx.points < 0)
      .reduce((sum, tx) => sum + tx.points, 0)
  );

  const filteredHistory = rawHistory.filter((tx) => {
    if (activeHistoryFilter === 'earned') return tx.points > 0;
    if (activeHistoryFilter === 'redeemed') return tx.points < 0;
    return true;
  });

  const handleRedeemClick = async (title: string, cost: number) => {
    if (currentPoints < cost) return;
    setIsRedeeming(title);
    try {
      await onRedeemReward(title, cost);
    } finally {
      setIsRedeeming(null);
    }
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  return (
    <div className="space-y-10" id="loyalty-rewards-section">
      {/* 1. Header & Summary Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2A1E17]/10 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A1E17]/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                Club Grove Program
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F]">
                Active Member
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-1">
              Loyalty Rewards
            </h2>
            <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-1 max-w-2xl font-light leading-relaxed">
              Earn 10 points for every $1 spent in our roastery café and online. Advance across artisan tiers to unlock complimentary handcrafted drinks, pastry vouchers, and private roasting workshops.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F6F2EC] px-4 py-2.5 rounded-2xl border border-[#2A1E17]/8 shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#C48B47]" />
            <div className="text-left">
              <span className="text-[10px] text-[#2A1E17]/60 uppercase font-semibold block">Member Status</span>
              <span className="text-xs font-bold text-[#2A1E17]">{currentTier.name}</span>
            </div>
          </div>
        </div>

        {/* 2. Visualizing Current Points: Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Available Points */}
          <div className="p-6 bg-gradient-to-br from-[#2A1E17] to-[#1E1510] rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C48B47]/15 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
                  Available Balance
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#D4A373]">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  {currentPoints}
                </span>
                <span className="text-sm font-medium text-white/70">Points</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60">Estimated store credit:</span>
              <span className="font-semibold text-[#D4A373]">
                ≈ ${(currentPoints * 0.1).toFixed(2)} Value
              </span>
            </div>
          </div>

          {/* Card 2: Current Membership Tier */}
          <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                  Current Membership Tier
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#C48B47]/15 text-[#C48B47]">
                  Tier {currentTierIndex + 1} of 4
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17] mt-2">
                {currentTier.name}
              </h3>
              <p className="text-xs text-[#2A1E17]/70 mt-1.5 leading-relaxed">
                {currentTier.multiplierText}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2A1E17]/10 flex items-center justify-between text-xs text-[#2A1E17]/60">
              <span>Next reward threshold:</span>
              <span className="font-bold text-[#2A1E17]">
                {nextTier ? `${nextTier.minPoints} pts` : 'Max Tier Unlocked'}
              </span>
            </div>
          </div>

          {/* Card 3: Lifetime Points Summary */}
          <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
                  Lifetime Accounting
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#1E3A2F]/10 flex items-center justify-center text-[#1E3A2F]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#2A1E17]/60">Total Points Earned</span>
                  <span className="font-serif text-lg font-bold text-[#1E3A2F]">
                    +{totalPointsEarned} pts
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#2A1E17]/60">Total Points Redeemed</span>
                  <span className="font-serif text-lg font-bold text-[#C48B47]">
                    -{totalPointsRedeemed} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2A1E17]/10 flex items-center justify-between text-xs text-[#2A1E17]/60">
              <span>Member Account:</span>
              <span className="font-semibold text-[#2A1E17]">{user.memberSince || 'Active'}</span>
            </div>
          </div>
        </div>

        {/* 3. Progress Toward Next Reward Tier (with visual Progress Bar) */}
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-2xl border border-[#2A1E17]/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C48B47]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                  Tier Progression & Milestones
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17] mt-1">
                {nextTier ? (
                  <>
                    Progress toward <span className="text-[#C48B47]">{nextTier.name}</span>
                  </>
                ) : (
                  'You Have Reached Top Platinum Tier!'
                )}
              </h3>
            </div>

            {nextTier && (
              <div className="bg-white px-4 py-2 rounded-xl border border-[#2A1E17]/10 shadow-xs text-right">
                <span className="text-[11px] text-[#2A1E17]/60 block font-medium">Points to unlock</span>
                <span className="font-serif text-lg font-bold text-[#C48B47]">
                  {pointsToNextTier} pts needed
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-[#2A1E17]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C48B47]" />
                Current: {currentPoints} pts ({currentTier.name})
              </span>
              <span>
                {nextTier ? `Target: ${nextTier.minPoints} pts (${nextTier.name})` : '100% Top Tier'}
              </span>
            </div>

            {/* Custom High-Contrast Progress Bar */}
            <div 
              className="w-full h-4 sm:h-5 bg-[#F6F2EC] rounded-full p-0.5 border border-[#2A1E17]/10 overflow-hidden relative shadow-inner"
              role="progressbar"
              aria-valuenow={currentPoints}
              aria-valuemin={0}
              aria-valuemax={nextTier ? nextTier.minPoints : 1000}
            >
              <div
                className="h-full bg-gradient-to-r from-[#A07855] via-[#C48B47] to-[#1E3A2F] rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${tierProgressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#2A1E17]/60 pt-1">
              <span>Tier Start: {currentTier.minPoints} pts</span>
              <span className="font-medium text-[#2A1E17]">
                {tierProgressPercent}% of tier completed
              </span>
              <span>Tier Goal: {nextTier ? `${nextTier.minPoints} pts` : `${currentTier.maxPoints} pts`}</span>
            </div>
          </div>

          {/* Milestone Tier Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-[#2A1E17]/10">
            {LOYALTY_TIERS.map((tier, idx) => {
              const isUnlocked = currentPoints >= tier.minPoints;
              const isCurrent = currentTier.id === tier.id;
              const isNext = nextTier?.id === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-2xl border transition-all text-left ${
                    isCurrent
                      ? 'bg-white border-[#C48B47] shadow-sm ring-2 ring-[#C48B47]/20'
                      : isUnlocked
                      ? 'bg-white/80 border-[#2A1E17]/10'
                      : isNext
                      ? 'bg-[#FDFBF7] border-dashed border-[#C48B47]/50'
                      : 'bg-[#F6F2EC]/40 border-[#2A1E17]/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A1E17]/50">
                      {tier.minPoints} pts
                    </span>
                    {isUnlocked ? (
                      <span className="w-5 h-5 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : isNext ? (
                      <span className="w-5 h-5 rounded-full bg-[#C48B47]/15 text-[#C48B47] flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[#2A1E17]/10 text-[#2A1E17]/40 flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-sm font-bold text-[#2A1E17] line-clamp-1">
                    {tier.name}
                  </h4>

                  <div className="mt-2">
                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-[#C48B47] bg-[#C48B47]/10 px-2 py-0.5 rounded-full inline-block">
                        Active Tier
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-medium text-[#1E3A2F] inline-block">
                        Unlocked
                      </span>
                    ) : isNext ? (
                      <span className="text-[10px] font-semibold text-[#C48B47] inline-block">
                        Next Tier ({tier.minPoints - currentPoints} pts away)
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#2A1E17]/50 inline-block">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Tier Perks Preview */}
          {nextTier && (
            <div className="bg-white p-5 rounded-2xl border border-[#2A1E17]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2A1E17] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C48B47]" />
                  What you unlock at {nextTier.name}:
                </span>
                <span className="text-[11px] text-[#C48B47] font-semibold">
                  {pointsToNextTier} points to go
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2A1E17]/80">
                {nextTier.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E3A2F] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Redeemed Banner / Voucher Notice */}
        {redeemedNotice && (
          <div className="p-4 bg-[#eef6f2] border border-[#1E3A2F]/20 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#1E3A2F] font-semibold">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1E3A2F]" />
              <span>{redeemedNotice}</span>
            </div>
            {redeemedNotice.includes('UGC-GIFT-') && (
              <button
                onClick={() => {
                  const codeMatch = redeemedNotice.match(/UGC-GIFT-\d+/);
                  if (codeMatch) copyCodeToClipboard(codeMatch[0]);
                }}
                className="px-3 py-1 bg-[#1E3A2F] text-white rounded-lg text-[11px] font-medium flex items-center gap-1 hover:bg-[#152a22] transition-colors"
              >
                {copiedVoucher ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedVoucher ? 'Copied' : 'Copy Code'}</span>
              </button>
            )}
          </div>
        )}

        {/* 4. History of Points Earned & Redeemed (Ledger) */}
        <div className="space-y-4 pt-4 border-t border-[#2A1E17]/10" id="points-history-ledger">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C48B47]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                  Ledger & Activity
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17] mt-0.5">
                History of Points Earned
              </h3>
              <p className="text-xs text-[#2A1E17]/60 font-light">
                Full chronological ledger of your earned points, dining purchases, event bonuses, and voucher redemptions.
              </p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-1.5 bg-[#F6F2EC] p-1 rounded-xl border border-[#2A1E17]/8 self-start sm:self-auto">
              <button
                onClick={() => setActiveHistoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeHistoryFilter === 'all'
                    ? 'bg-white text-[#2A1E17] shadow-xs'
                    : 'text-[#2A1E17]/60 hover:text-[#2A1E17]'
                }`}
              >
                All ({rawHistory.length})
              </button>
              <button
                onClick={() => setActiveHistoryFilter('earned')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  activeHistoryFilter === 'earned'
                    ? 'bg-white text-[#1E3A2F] shadow-xs'
                    : 'text-[#2A1E17]/60 hover:text-[#2A1E17]'
                }`}
              >
                <ArrowUpRight className="w-3 h-3 text-[#1E3A2F]" />
                Earned ({rawHistory.filter((t) => t.points > 0).length})
              </button>
              <button
                onClick={() => setActiveHistoryFilter('redeemed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  activeHistoryFilter === 'redeemed'
                    ? 'bg-white text-[#C48B47] shadow-xs'
                    : 'text-[#2A1E17]/60 hover:text-[#2A1E17]'
                }`}
              >
                <ArrowDownLeft className="w-3 h-3 text-[#C48B47]" />
                Redeemed ({rawHistory.filter((t) => t.points < 0).length})
              </button>
            </div>
          </div>

          {/* History Item List */}
          <div className="bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 divide-y divide-[#2A1E17]/8 overflow-hidden">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#2A1E17]/60">
                No activity found for this filter.
              </div>
            ) : (
              filteredHistory.map((tx) => {
                const isEarned = tx.points > 0;
                
                // Icon helper
                let IconComponent = ShoppingBag;
                let badgeLabel = 'Order Purchase';
                if (tx.type === 'event') {
                  IconComponent = Calendar;
                  badgeLabel = 'Event RSVP';
                } else if (tx.type === 'review') {
                  IconComponent = Star;
                  badgeLabel = 'Review Feedback';
                } else if (tx.type === 'bonus') {
                  IconComponent = Gift;
                  badgeLabel = 'Bonus Gift';
                } else if (tx.type === 'redemption') {
                  IconComponent = Sparkles;
                  badgeLabel = 'Reward Redeemed';
                }

                return (
                  <div
                    key={tx.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isEarned
                            ? 'bg-[#1E3A2F]/10 text-[#1E3A2F]'
                            : 'bg-[#C48B47]/15 text-[#C48B47]'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-sm sm:text-base font-bold text-[#2A1E17]">
                            {tx.description}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              isEarned
                                ? 'bg-[#1E3A2F]/10 text-[#1E3A2F]'
                                : 'bg-[#C48B47]/15 text-[#C48B47]'
                            }`}
                          >
                            {badgeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[#2A1E17]/60 font-light flex items-center gap-2">
                          <span>{tx.date}</span>
                          {tx.balanceAfter !== undefined && (
                            <>
                              <span>•</span>
                              <span>Balance after: <strong className="font-semibold text-[#2A1E17]">{tx.balanceAfter} pts</strong></span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2A1E17]/5 shrink-0">
                      <span
                        className={`text-base font-bold font-serif px-3 py-1 rounded-xl ${
                          isEarned
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-900 border border-amber-200/60'
                        }`}
                      >
                        {isEarned ? `+${tx.points}` : tx.points} pts
                      </span>
                      <span className="text-[10px] text-[#2A1E17]/50 mt-1">
                        {isEarned ? 'Points Earned' : 'Points Redeemed'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 5. Redeemable Rewards Catalog */}
        <div className="space-y-4 pt-6 border-t border-[#2A1E17]/10" id="redeemable-rewards-catalog">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
              Rewards Catalog
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1E17] mt-0.5">
              Redeem Your Available Points
            </h3>
            <p className="text-xs text-[#2A1E17]/60 font-light">
              Select an artisan perk below. A unique digital gift voucher will be generated instantly for mobile or barista checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Reward 1: 100 Points */}
            <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4 hover:border-[#C48B47]/40 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C48B47] uppercase tracking-wider">
                    100 Points
                  </span>
                  <Coffee className="w-4 h-4 text-[#C48B47]" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17] mt-1.5">
                  Espresso Shot / Syrup Upgrade
                </h4>
                <p className="text-xs text-[#2A1E17]/60 mt-1 font-light leading-relaxed">
                  Add an extra double ristretto shot or artisanal organic Madagascar vanilla pump.
                </p>
              </div>
              <button
                onClick={() => handleRedeemClick('Free Espresso Shot Upgrade', 100)}
                disabled={currentPoints < 100 || isRedeeming === 'Free Espresso Shot Upgrade'}
                className="w-full py-2.5 px-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl disabled:opacity-30 disabled:hover:bg-[#2A1E17] transition-colors"
              >
                {currentPoints < 100 ? 'Need 100 pts' : 'Redeem 100 pts'}
              </button>
            </div>

            {/* Reward 2: 200 Points */}
            <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4 hover:border-[#C48B47]/40 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C48B47] uppercase tracking-wider">
                    200 Points
                  </span>
                  <Gift className="w-4 h-4 text-[#C48B47]" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17] mt-1.5">
                  Artisan French Butter Croissant
                </h4>
                <p className="text-xs text-[#2A1E17]/60 mt-1 font-light leading-relaxed">
                  Freshly laminated French butter pastry baked fresh daily at dawn.
                </p>
              </div>
              <button
                onClick={() => handleRedeemClick('Complimentary French Croissant', 200)}
                disabled={currentPoints < 200 || isRedeeming === 'Complimentary French Croissant'}
                className="w-full py-2.5 px-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl disabled:opacity-30 disabled:hover:bg-[#2A1E17] transition-colors"
              >
                {currentPoints < 200 ? 'Need 200 pts' : 'Redeem 200 pts'}
              </button>
            </div>

            {/* Reward 3: 300 Points */}
            <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4 hover:border-[#C48B47]/40 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C48B47] uppercase tracking-wider">
                    300 Points
                  </span>
                  <Sparkles className="w-4 h-4 text-[#C48B47]" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17] mt-1.5">
                  Signature Specialty Latte
                </h4>
                <p className="text-xs text-[#2A1E17]/60 mt-1 font-light leading-relaxed">
                  Any single-origin reserve latte, matcha mist, or slow-drip nitro cold brew.
                </p>
              </div>
              <button
                onClick={() => handleRedeemClick('Complimentary Specialty Latte', 300)}
                disabled={currentPoints < 300 || isRedeeming === 'Complimentary Specialty Latte'}
                className="w-full py-2.5 px-3 bg-[#C48B47] hover:bg-[#b37c3b] text-white text-xs font-semibold rounded-xl disabled:opacity-30 disabled:hover:bg-[#C48B47] transition-colors"
              >
                {currentPoints < 300 ? 'Need 300 pts' : 'Redeem 300 pts'}
              </button>
            </div>

            {/* Reward 4: 450 Points */}
            <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4 hover:border-[#C48B47]/40 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C48B47] uppercase tracking-wider">
                    450 Points
                  </span>
                  <Award className="w-4 h-4 text-[#C48B47]" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17] mt-1.5">
                  250g Whole Bean Retail Bag
                </h4>
                <p className="text-xs text-[#2A1E17]/60 mt-1 font-light leading-relaxed">
                  Take home your choice of seasonal Ethiopian or Colombian whole bean coffee.
                </p>
              </div>
              <button
                onClick={() => handleRedeemClick('250g Whole Bean Coffee Bag', 450)}
                disabled={currentPoints < 450 || isRedeeming === '250g Whole Bean Coffee Bag'}
                className="w-full py-2.5 px-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl disabled:opacity-30 disabled:hover:bg-[#2A1E17] transition-colors"
              >
                {currentPoints < 450 ? `Need ${450 - currentPoints} more pts` : 'Redeem 450 pts'}
              </button>
            </div>
          </div>
        </div>

        {/* 6. Ways to Earn Points */}
        <div className="bg-[#F6F2EC]/60 p-5 rounded-2xl border border-[#2A1E17]/8">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#C48B47]" />
            <h4 className="font-serif text-sm font-bold text-[#2A1E17]">
              Ways to Accelerate Your Point Earnings
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#2A1E17]/70">
            <div className="bg-white p-3 rounded-xl border border-[#2A1E17]/5">
              <span className="font-bold text-[#2A1E17] block">10 Pts per $1</span>
              On all food, espresso, and retail bean purchases.
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#2A1E17]/5">
              <span className="font-bold text-[#2A1E17] block">+50 Bonus Pts</span>
              For attending any weekend live music or education event.
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#2A1E17]/5">
              <span className="font-bold text-[#2A1E17] block">+25 Bonus Pts</span>
              When you share verified feedback or reviews.
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#2A1E17]/5">
              <span className="font-bold text-[#2A1E17] block">2x Points Tuesdays</span>
              Double points on all seasonal signature drinks.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
