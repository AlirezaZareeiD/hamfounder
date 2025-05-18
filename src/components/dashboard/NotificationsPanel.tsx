import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  UserPlus, 
  Calendar, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationsPanel = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    connections: true,
    events: true,
    system: true,
  });
  
  // Mock data for notifications
  const notifications = {
    unread: [
      {
        id: 1,
        type: 'connection',
        content: 'Mina Rahimi has accepted your connection request.',
        time: '10 minutes ago',
        avatar: '',
        isRead: false
      },
      {
        id: 2,
        type: 'message',
        content: 'You have a new message from Ali Mohammadi about your project.',
        time: '30 minutes ago',
        avatar: '',
        isRead: false
      },
      {
        id: 3,
        type: 'event',
        content: 'Reminder: "Iranian Founders Global Meetup" starts in 2 hours.',
        time: '1 hour ago',
        avatar: '',
        isRead: false
      },
      {
        id: 4,
        type: 'system',
        content: 'Your profile is 65% complete. Add more information to improve your visibility.',
        time: '2 hours ago',
        avatar: '',
        isRead: false
      }
    ],
    read: [
      {
        id: 5,
        type: 'connection',
        content: 'Reza Ahmadi has viewed your profile.',
        time: '1 day ago',
        avatar: '',
        isRead: true
      },
      {
        id: 6,
        type: 'message',
        content: 'Sara Tehrani replied to your comment on "Funding Strategies".',
        time: '2 days ago',
        avatar: '',
        isRead: true
      },
      {
        id: 7,
        type: 'system',
        content: 'New learning resource added to your recommended list: "Lean Startup Methodology".',
        time: '3 days ago',
        avatar: '',
        isRead: true
      }
    ]
  };
  
  // Helper function to get the appropriate icon for each notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-slate-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1">{notifications.unread.length + notifications.read.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge variant="secondary" className="ml-1">{notifications.unread.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="m-0 space-y-4">
          {notifications.unread.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-500">New</h2>
              {notifications.unread.map((notification) => (
                <Card key={notification.id} className="bg-blue-50 border-blue-100 hover:bg-blue-100/70 transition-colors">
                  <CardContent className="p-4 flex">
                    <div className="mr-4 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm mb-1">{notification.content}</p>
                      <span className="text-xs text-slate-500">{notification.time}</span>
                    </div>
                    <div className="flex items-start ml-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {notifications.read.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-500">Earlier</h2>
              {notifications.read.map((notification) => (
                <Card key={notification.id} className="hover:bg-slate-50 transition-colors">
                  <CardContent className="p-4 flex">
                    <div className="mr-4 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm mb-1">{notification.content}</p>
                      <span className="text-xs text-slate-500">{notification.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="unread" className="m-0 space-y-4">
          {notifications.unread.length > 0 ? (
            notifications.unread.map((notification) => (
              <Card key={notification.id} className="bg-blue-50 border-blue-100 hover:bg-blue-100/70 transition-colors">
                <CardContent className="p-4 flex">
                  <div className="mr-4 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm mb-1">{notification.content}</p>
                    <span className="text-xs text-slate-500">{notification.time}</span>
                  </div>
                  <div className="flex items-start ml-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-medium mb-1">All caught up!</h3>
              <p className="text-sm text-slate-500">You have no unread notifications.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="m-0 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center text-base font-medium">
                      <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                      Messages
                    </div>
                    <p className="text-sm text-slate-500">
                      Receive notifications when someone sends you a message
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.messages}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, messages: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center text-base font-medium">
                      <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                      Connections
                    </div>
                    <p className="text-sm text-slate-500">
                      Receive notifications about connection requests and profile views
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.connections}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, connections: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center text-base font-medium">
                      <Calendar className="h-4 w-4 mr-2 text-green-500" />
                      Events & Webinars
                    </div>
                    <p className="text-sm text-slate-500">
                      Receive reminders about upcoming events and webinars
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.events}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, events: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center text-base font-medium">
                      <Info className="h-4 w-4 mr-2 text-slate-500" />
                      System Updates
                    </div>
                    <p className="text-sm text-slate-500">
                      Receive notifications about platform updates and new features
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.system}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, system: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Email Notification Frequency</h3>
              <div className="grid gap-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="realtime"
                    name="frequency"
                    className="mt-1"
                    defaultChecked
                  />
                  <div>
                    <label htmlFor="realtime" className="text-base font-medium">
                      Real-time
                    </label>
                    <p className="text-sm text-slate-500">
                      Receive email notifications immediately when events occur
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="daily"
                    name="frequency"
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="daily" className="text-base font-medium">
                      Daily digest
                    </label>
                    <p className="text-sm text-slate-500">
                      Receive one email per day summarizing all notifications
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="weekly"
                    name="frequency"
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="weekly" className="text-base font-medium">
                      Weekly digest
                    </label>
                    <p className="text-sm text-slate-500">
                      Receive one email per week summarizing all notifications
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-6 w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
