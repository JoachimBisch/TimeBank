import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'exchange' | 'booking' | 'completion';
  title: string;
  timestamp: Date;
  hours: number;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
        <Activity className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-black" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500">
                {activity.hours}h • {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};