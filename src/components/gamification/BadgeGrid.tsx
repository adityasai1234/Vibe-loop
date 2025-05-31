import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { EarnedBadge, BadgeDefinition, BadgeType } from '../../types/gamification';
import { motion } from 'framer-motion';
// import Lottie from 'lottie-react'; // If using Lottie for badge icons

interface BadgeItemProps {
  earnedBadge: EarnedBadge;
  badgeDefinition?: BadgeDefinition | null; // Fetched separately or passed down
  onClick?: () => void;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ earnedBadge, badgeDefinition, onClick }) => {
  if (!badgeDefinition) {
    // Placeholder or loading state for badge definition
    return (
      <motion.div 
        className="bg-gray-700 p-4 rounded-lg shadow-lg text-center animate-pulse"
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
      >
        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-1"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto"></div>
      </motion.div>
    );
  }

  // TODO: Add Lottie animation if iconUrl points to a Lottie JSON
  // const isLottie = badgeDefinition.iconUrl.endsWith('.json');

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-xl text-center cursor-pointer 
                  ${earnedBadge.seen ? 'opacity-70' : 'opacity-100'} 
                  border-2 ${badgeDefinition.rarity === 'LEGENDARY' ? 'border-yellow-400' : 
                              badgeDefinition.rarity === 'EPIC' ? 'border-purple-500' : 
                              badgeDefinition.rarity === 'RARE' ? 'border-blue-400' : 'border-gray-600'}`}
      whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(255,255,255,0.2)' }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* {isLottie ? (
        <Lottie animationData={badgeDefinition.iconUrl} loop={true} style={{ width: 64, height: 64, margin: '0 auto' }} />
      ) : ( */} 
      <img src={badgeDefinition.iconUrl} alt={badgeDefinition.name} className="w-16 h-16 mx-auto mb-2 rounded-full object-cover" />
      {/* )} */}
      <h3 className="text-md font-semibold text-white truncate" title={badgeDefinition.name}>{badgeDefinition.name}</h3>
      <p className="text-xs text-gray-400 truncate" title={badgeDefinition.description}>{badgeDefinition.description}</p>
      {!earnedBadge.seen && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></div>
      )}
    </motion.div>
  );
};

interface BadgeGridProps {
  title: string;
  badgeType: BadgeType;
  onBadgeClick?: (badgeId: string, badgeType: BadgeType) => void;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ title, badgeType, onBadgeClick }) => {
  const { gamificationData, getBadgeDetails, markBadgeAsSeen } = useGamification();
  const [badgeDefinitions, setBadgeDefinitions] = React.useState<Record<string, BadgeDefinition | null>>({});

  const badgesToDisplay: EarnedBadge[] = React.useMemo(() => {
    if (!gamificationData) return [];
    switch (badgeType) {
      case BadgeType.MOOD_EXPLORER:
        return gamificationData.moodExplorerBadges;
      case BadgeType.GENRE_COLLECTOR:
        return gamificationData.genreCollectorBadges;
      case BadgeType.SEASONAL_ACHIEVEMENT:
        return gamificationData.seasonalAchievements;
      default:
        return [];
    }
  }, [gamificationData, badgeType]);

  React.useEffect(() => {
    const fetchDefs = async () => {
      const defs: Record<string, BadgeDefinition | null> = {};
      for (const badge of badgesToDisplay) {
        if (!badgeDefinitions[badge.badgeId]) { // Fetch only if not already fetched
          const detail = await getBadgeDetails(badge.badgeId);
          defs[badge.badgeId] = detail;
        }
      }
      if (Object.keys(defs).length > 0) {
        setBadgeDefinitions(prev => ({ ...prev, ...defs }));
      }
    };
    if (badgesToDisplay.length > 0) {
      fetchDefs();
    }
  }, [badgesToDisplay, getBadgeDetails, badgeDefinitions]);

  const handleBadgeClick = (badge: EarnedBadge) => {
    if (!badge.seen) {
        let typeForMarking: 'moodExplorer' | 'genreCollector' | 'seasonal' | undefined;
        if (badgeType === BadgeType.MOOD_EXPLORER) typeForMarking = 'moodExplorer';
        else if (badgeType === BadgeType.GENRE_COLLECTOR) typeForMarking = 'genreCollector';
        else if (badgeType === BadgeType.SEASONAL_ACHIEVEMENT) typeForMarking = 'seasonal';
        
        if(typeForMarking) markBadgeAsSeen(badge.badgeId, typeForMarking);
    }
    if (onBadgeClick) onBadgeClick(badge.badgeId, badgeType);
    // Potentially open a modal with more badge details here
  };

  if (!gamificationData || badgesToDisplay.length === 0) {
    return (
      <div className="my-4 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
        <p className="text-gray-400">No badges earned in this category yet. Keep exploring Vibe-Loop!</p>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badgesToDisplay.sort((a,b) => b.earnedAt - a.earnedAt).map((earnedBadge) => (
          <BadgeItem 
            key={earnedBadge.badgeId} 
            earnedBadge={earnedBadge} 
            badgeDefinition={badgeDefinitions[earnedBadge.badgeId]}
            onClick={() => handleBadgeClick(earnedBadge)}
          />
        ))}
      </div>
    </div>
  );
};