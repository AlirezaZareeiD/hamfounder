import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Globe,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Search,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const EventsCommunity = () => {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true); // Initially show right fade
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Iranian Founders Global Meetup",
      description: "Connect with Iranian entrepreneurs from around the world in this virtual networking event.",
      type: "Virtual",
      date: "2025-06-15T18:00:00",
      duration: "2 hours",
      category: "Networking",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "From Tehran to Silicon Valley: Success Stories",
      description: "Join us for inspirational talks from Iranian entrepreneurs who built successful global businesses.",
      type: "Virtual",
      date: "2025-06-18T15:00:00",
      duration: "1.5 hours",
      category: "Panel Discussion",
      attendees: 85,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Toronto Iranian Tech Meetup",
      description: "Local meetup for Iranian tech professionals and entrepreneurs in Toronto area.",
      type: "In-Person",
      location: "Toronto, Canada",
      date: "2025-06-20T18:30:00",
      duration: "3 hours",
      category: "Local Meetup",
      attendees: 45,
      image: "https://images.unsplash.com/photo-1511795409834-c3e48d3359ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      title: "Startup Funding Workshop",
      description: "Learn strategies for raising capital for your startup in international markets.",
      type: "Virtual",
      date: "2025-06-25T17:00:00",
      duration: "2 hours",
      category: "Workshop",
      attendees: 65,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  // Mock data for communities
  const communities = [
    {
      id: 1,
      name: "Iranian Founders Network",
      description: "The largest community of Iranian entrepreneurs and startup founders worldwide.",
      members: 2850,
      topics: ["Startups", "Innovation", "Global Business"],
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Persian Tech Innovators",
      description: "Community focused on technology innovation and digital transformation.",
      members: 1450,
      topics: ["Technology", "AI", "Digital Products"],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Iranian Women in Business",
      description: "Supporting and connecting Iranian women entrepreneurs globally.",
      members: 980,
      topics: ["Women Entrepreneurs", "Leadership", "Mentorship"],
      image: "https://images.unsplash.com/photo-1573164713349-6e4b873ef24a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter events based on the selected filter
  const filteredEvents = filter === 'all' ? events :
    events.filter(event => {
      if (filter === 'virtual') return event.type === 'Virtual';
      if (filter === 'in-person') return event.type === 'In-Person';
      return true;
    });

  const checkFadeEffects = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      const atLeftEnd = scrollLeft === 0;
      const atRightEnd = scrollLeft + clientWidth >= scrollWidth - 1; // Allow for 1px tolerance

      setShowLeftFade(!atLeftEnd);
      setShowRightFade(!atRightEnd);
    }
  };

  useEffect(() => {
    // Check fade effects initially and on window resize
    checkFadeEffects();
    const handleResize = () => checkFadeEffects();
    window.addEventListener('resize', handleResize);

    // Check fade effects when tabs are clicked (content changes might affect scrollWidth)
    const observer = new MutationObserver(checkFadeEffects);
    if (tabsListRef.current) {
      observer.observe(tabsListRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
       if (tabsListRef.current) {
         observer.disconnect();
       }
    };
  }, []);

  useEffect(() => {
    // Re-check fade effects after scroll
    const handleScroll = () => {
      checkFadeEffects();
    };
    tabsListRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      tabsListRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> {/* Adjusted flex for mobile */}
        <h1 className="text-2xl font-bold text-slate-900">Events & Community</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto"> {/* Adjusted flex and spacing for mobile */}
          <div className="relative w-full sm:w-auto"> {/* Made search full width on mobile */}
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <Button className="w-full sm:w-auto"> {/* Made button full width on mobile */}
            <Calendar className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="events">
        <div className="relative"> {/* Added relative positioning for fades */}
           {/* Left Fade */}
          {showLeftFade && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 sm:hidden"></div> // Only visible on small screens
          )}

          {/* TabsList with overflow-x-auto and flex-nowrap for mobile scrollability */}
          <TabsList
             ref={tabsListRef}
             className="mb-6 w-full justify-start overflow-x-auto flex-nowrap scrollbar-hide px-4 sm:px-0" // Added horizontal padding for fades
             onScroll={checkFadeEffects} // Check fade visibility on scroll
          >
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* Right Fade */}
          {showRightFade && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden"></div> // Only visible on small screens
          )}
        </div>


        <TabsContent value="events" className="m-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4"> {/* Adjusted flex for mobile */}
            <div className="flex flex-wrap gap-2"> {/* Allowed filter buttons to wrap on mobile */}
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Events
              </Button>
              <Button
                variant={filter === 'virtual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('virtual')}
              >
                <Globe className="h-4 w-4 mr-1" />
                Virtual
              </Button>
              <Button
                variant={filter === 'in-person' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('in-person')}
              >
                <MapPin className="h-4 w-4 mr-1" />
                In-Person
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={view === 'list' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                List
              </Button>
              <Button
                variant={view === 'grid' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setView('grid')}
              >
                Grid
              </Button>
            </div>
          </div>

          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
            {filteredEvents.map((event) => (
              view === 'grid' ? (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <AspectRatio ratio={16/9}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{event.category}</Badge>
                    <h3 className="font-bold mb-1">{event.title}</h3>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs text-slate-500 mb-2 gap-1 sm:gap-0"> {/* Adjusted flex for mobile */}
                      <div className="flex items-center">
                         <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                       <div className="flex items-center sm:ml-2"> {/* Added margin for spacing on desktop */}
                         <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">{event.description}</p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0"> {/* Adjusted flex for mobile */}
                      <Badge variant={event.type === 'Virtual' ? 'secondary' : 'outline'}>
                        {event.type === 'Virtual' ? (
                          <Globe className="h-3 w-3 mr-1" />
                        ) : (
                          <MapPin className="h-3 w-3 mr-1" />
                        )}
                        {event.type}
                        {event.location && ` • ${event.location}`}
                      </Badge>

                      <span className="text-xs text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendees} attending
                      </span>
                    </div>

                    <Button className="w-full mt-3">Register Now</Button> {/* Made button full width on mobile */}
                  </CardContent>
                </Card>
              ) : (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row"> {/* Adjusted flex for mobile */}
                      <div className="mr-0 sm:mr-4 mb-4 sm:mb-0 flex-shrink-0 w-full sm:w-24 bg-slate-50 rounded-md border p-2 text-center"> {/* Adjusted width and margin for mobile */}
                        <span className="block text-sm font-medium text-slate-500">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="block text-2xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-bold">{event.title}</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs text-slate-500 gap-1 sm:gap-0"> {/* Adjusted flex for mobile */}
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatTime(event.date)} • {event.duration}</span>
                              </div>
                              {event.type === 'In-Person' && event.location && (
                                <div className="flex items-center sm:ml-2"> {/* Added margin for spacing on desktop */}
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Badge variant={event.type === 'Virtual' ? 'secondary' : 'outline'}>
                            {event.type === 'Virtual' ? (
                              <Globe className="h-3 w-3 mr-1" />
                            ) : (
                              <MapPin className="h-3 w-3 mr-1" />
                            )}
                            {event.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{event.description}</p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"> {/* Adjusted flex for mobile */}
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">{event.category}</Badge>
                            <span className="text-xs text-slate-500 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {event.attendees} attending
                            </span>
                          </div>

                          <Button size="sm" className="w-full sm:w-auto">Register</Button> {/* Made button full width on mobile */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline">
              View All Events
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="communities" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {communities.map((community) => (
              <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <AspectRatio ratio={16/9}>
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <h3 className="font-bold text-white">{community.name}</h3>
                  </div>
                </AspectRatio>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 mb-3">{community.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {community.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0"> {/* Adjusted flex for mobile */}
                    <span className="text-sm text-slate-500 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {community.members.toLocaleString()} members
                    </span>
                    <Button size="sm" className="w-full sm:w-auto">Join</Button> {/* Made button full width on mobile */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="m-0 p-4 border rounded-md mt-4">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">Calendar View Coming Soon</h3>
              <p className="text-slate-500 max-w-md">
                We're working on a full calendar view that will allow you to see all events and schedule your own.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsCommunity;
