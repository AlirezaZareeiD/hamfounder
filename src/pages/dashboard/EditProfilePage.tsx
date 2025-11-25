import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Lightbulb,
  Target,
  Star,
  MapPin,
  Twitter,
  Linkedin,
  Globe,
  Save,
  Sparkles,
  Rocket,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile, auth, updateUserProfile } from '@/lib/firebase';
import { ProfileImageUploader } from '@/components/dashboard/ProfileImageUploader';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import MemberModal from '@/components/dashboard/find-cofounder/MemberModal';


const EditProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);


  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    pronouns: '',
    tagline: '',
    location: '',
    linkedinUrl: '',
    twitterUrl: '',
    personalSummary: '',
    role: '',
    lookingFor: '',
    businessStage: '',
    skills: [] as string[],
    interests: [] as string[],
    companyName: '',
    companyWebsiteUrl: '',
    profileImageUrl: '',
    companyLogoUrl: ''
  });


  const { toast } = useToast();
  const urlPattern = /^(https?:\/\/).+$/;


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          const profile = await getUserProfile(userId);
          if (profile) {
            setProfileData({
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              displayName: profile.displayName || '',
              pronouns: profile.pronouns || '',
              tagline: profile.tagline || '',
              location: profile.location || '',
              linkedinUrl: profile.linkedinUrl || '',
              twitterUrl: profile.twitterUrl || '',
              personalSummary: profile.personalSummary || '',
              role: profile.role || '',
              lookingFor: profile.lookingFor || '',
              businessStage: profile.businessStage || '',
              skills: profile.skills || [],
              interests: profile.interests || [],
              companyName: profile.companyName || '',
              companyWebsiteUrl: profile.companyWebsiteUrl || '',
              profileImageUrl: profile.profileImageUrl || '',
              companyLogoUrl: profile.companyLogoUrl || ''
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast({ title: "Error", description: "Failed to fetch user profile.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);


  const handleProfileImageUpdate = (imageUrl: string) => {
    setProfileData(prev => ({ ...prev, profileImageUrl: imageUrl }));
  };


  const handleCompanyLogoUpdate = (imageUrl: string) => {
    setProfileData(prev => ({ ...prev, companyLogoUrl: imageUrl }));
  };


  const handleInputChange = (field: keyof typeof profileData, value: string | string[]) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSave = async (section: string) => {
    setIsSaving(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      toast({ title: "Error", description: "You must be logged in to save.", variant: "destructive" });
      setIsSaving(false);
      return;
    }


    let dataToSave: Partial<typeof profileData> = {};
    let successMessage = "";
    let errorMessage = "";


    try {
        if (section === 'personal') {
            if ((profileData.linkedinUrl && !urlPattern.test(profileData.linkedinUrl)) ||
              (profileData.twitterUrl && !urlPattern.test(profileData.twitterUrl))) {
              toast({ title: "Invalid URL", description: "Please enter a valid URL (starting with http:// or https://)", variant: "destructive" });
              setIsSaving(false);
              return;
            }
            dataToSave = {
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              displayName: profileData.displayName,
              pronouns: profileData.pronouns,
              tagline: profileData.tagline,
              location: profileData.location,
              linkedinUrl: profileData.linkedinUrl,
              twitterUrl: profileData.twitterUrl,
            };
            successMessage = "Founder Profile updated successfully.";
            errorMessage = "Failed to save Founder Profile.";
          } else if (section === 'journey') {
            dataToSave = {
              personalSummary: profileData.personalSummary,
            };
            successMessage = "My Entrepreneurial Journey updated successfully.";
            errorMessage = "Failed to save My Entrepreneurial Journey.";
          } else if (section === 'professional') {
            if (profileData.companyWebsiteUrl && !urlPattern.test(profileData.companyWebsiteUrl)) {
              toast({ title: "Invalid URL", description: "Please enter a valid Startup Website URL (starting with http:// or https://)", variant: "destructive" });
              setIsSaving(false);
              return;
            }
            dataToSave = {
              role: profileData.role,
              lookingFor: profileData.lookingFor,
              businessStage: profileData.businessStage,
              skills: profileData.skills,
              interests: profileData.interests,
              companyName: profileData.companyName,
              companyWebsiteUrl: profileData.companyWebsiteUrl,
            };
            successMessage = "Professional Background updated successfully.";
            errorMessage = "Failed to save Professional Background.";
          }


      await updateUserProfile(userId, dataToSave);
      toast({ title: "Success", description: successMessage, variant: "default" });
    } catch (error) {
      console.error(`Error saving ${section} info:`, error);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };


  const getProfileCompletion = () => {
    const fields = [
      'firstName', 'lastName', 'tagline', 'location', 'personalSummary',
      'role', 'lookingFor', 'businessStage', 'companyName'
    ];
    const completedFields = fields.filter(field => {
        const value = profileData[field as keyof typeof profileData];
        return value && String(value).trim() !== '';
    }).length;
    const skillsBonus = profileData.skills.length > 0 ? 1 : 0;
    const interestsBonus = profileData.interests.length > 0 ? 1 : 0;
   
    return Math.round(((completedFields + skillsBonus + interestsBonus) / (fields.length + 2)) * 100);
  };
 
  const myProfileForPreview = {
    id: auth.currentUser?.uid || '',
    name: profileData.displayName || `${profileData.firstName} ${profileData.lastName}`,
    avatar: profileData.profileImageUrl,
    role: profileData.role,
    skills: profileData.skills,
    location: profileData.location,
    bio: profileData.personalSummary,
    experience: profileData.businessStage,
    industry: 'N/A',
    lookingFor: profileData.lookingFor,
    linkedinUrl: profileData.linkedinUrl,
    twitterUrl: profileData.twitterUrl,
    website: profileData.companyWebsiteUrl,
    achievements: [],
    isOnline: true,
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 text-center flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span className="text-xl font-medium">Loading Profile...</span>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20">
        <div className="container mx-auto py-8 px-4 max-w-5xl">
         
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                ✨ Customize Your Profile
              </h1>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🚀</div>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Tell your entrepreneurial story and connect with your ideal co-founders
            </p>
           
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Profile Progress</span>
                <span className="text-sm font-bold text-primary">{getProfileCompletion()}%</span>
              </div>
              <Progress value={getProfileCompletion()} className="h-3" />
            </div>
          </div>


          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap md:grid md:grid-cols-3 w-full mb-8 bg-gradient-to-r from-primary/10 to-purple-100/50 p-1">
              <TabsTrigger value="personal" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md flex-1">
                <User className="h-4 w-4" />
                <span className="md:hidden">Personal</span>
                <span className="hidden md:inline">Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md flex-1">
                <Rocket className="h-4 w-4" />
                <span className="md:hidden">Journey</span>
                <span className="hidden md:inline">Entrepreneurial Journey</span>
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md flex-1">
                <TrendingUp className="h-4 w-4" />
                <span className="md:hidden">Professional</span>
                <span className="hidden md:inline">Professional Background</span>
              </TabsTrigger>
            </TabsList>


            <TabsContent value="personal" className="space-y-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Founder Identity
                  </CardTitle>
                  <CardDescription>
                    Enter your key information so others can get to know you
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                 
                  <ProfileImageUploader
                    userProfileImage={profileData.profileImageUrl}
                    userId={auth.currentUser?.uid || ''}
                    onImageUpdate={handleProfileImageUpdate}
                    type="profile"
                  />


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="Your first name"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="Your last name"
                      />
                    </div>


                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="publicIdentity" className="text-sm font-medium">Your Public Identity</Label>
                      <Input
                        id="publicIdentity"
                        value={profileData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="e.g. John Doe or Your Startup Name"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="pronouns" className="text-sm font-medium">Pronouns</Label>
                      <Select
                        value={profileData.pronouns}
                        onValueChange={(value) => handleInputChange('pronouns', value)}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:scale-105">
                          <SelectValue placeholder="Select Pronouns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="She/Her">She/Her</SelectItem>
                          <SelectItem value="He/Him">He/Him</SelectItem>
                          <SelectItem value="They/Them">They/Them</SelectItem>
                          <SelectItem value="Don't Want To Share">Don't Want To Share</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="City, Country"
                      />
                    </div>


                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tagline" className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Tagline
                      </Label>
                      <Input
                        id="tagline"
                        value={profileData.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="Describe yourself in one sentence..."
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-sm font-medium flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedinUrl"
                        value={profileData.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl" className="text-sm font-medium flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Label>
                      <Input
                        id="twitterUrl"
                        value={profileData.twitterUrl}
                        onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>


                  <Button
                    onClick={() => handleSave('personal')}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Personal Info
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="journey" className="space-y-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Rocket className="h-5 w-5 text-orange-600" />
                    </div>
                    Your Entrepreneurial Journey
                  </CardTitle>
                  <CardDescription>
                    Tell your story - how did you start your entrepreneurial path? What experiences have you had?
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Label htmlFor="entrepreneurialJourney" className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Your story can inspire others
                    </Label>
                    <Textarea
                      id="entrepreneurialJourney"
                      value={profileData.personalSummary}
                      onChange={(e) => handleInputChange('personalSummary', e.target.value)}
                      className="min-h-[200px] transition-all duration-300 focus:scale-[1.02] resize-none"
                      placeholder="Tell your entrepreneurial story here..."
                    />
                    <div className="text-xs text-muted-foreground text-left">
                      {profileData.personalSummary.length} characters
                    </div>
                  </div>


                  <Button
                    onClick={() => handleSave('journey')}
                    disabled={isSaving}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Entrepreneurial Journey
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="professional" className="space-y-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    Professional Background
                  </CardTitle>
                  <CardDescription>
                    Complete your startup info, skills and professional interests
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                 
                  <ProfileImageUploader
                    userProfileImage={profileData.companyLogoUrl}
                    userId={auth.currentUser?.uid || ''}
                    onImageUpdate={handleCompanyLogoUpdate}
                    type="companyLogo"
                  />


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">Your Role</Label>
                      <Input
                        id="role"
                        value={profileData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="e.g. Founder, CEO, CTO"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="lookingFor" className="text-sm font-medium">Looking For</Label>
                      <Select
                        value={profileData.lookingFor}
                        onValueChange={(value) => handleInputChange('lookingFor', value)}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:scale-105">
                          <SelectValue placeholder="Select What You're Looking For" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Co-founder">Co-founder</SelectItem>
                          <SelectItem value="Mentorship">Mentorship</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                          <SelectItem value="Talent">Talent</SelectItem>
                          <SelectItem value="Networking">Networking</SelectItem>
                          <SelectItem value="Advisory">Advisory</SelectItem>
                          <SelectItem value="Collaboration">Collaboration</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="businessStage" className="text-sm font-medium">Business Stage</Label>
                      <Select
                        value={profileData.businessStage}
                        onValueChange={(value) => handleInputChange('businessStage', value)}
                      >
                        <SelectTrigger className="transition-all duration-300 hover:scale-105">
                          <SelectValue placeholder="Select Business Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Idea">Idea</SelectItem>
                          <SelectItem value="Prototype">Prototype</SelectItem>
                          <SelectItem value="MVP">MVP</SelectItem>
                          <SelectItem value="Early Stage">Early Stage</SelectItem>
                          <SelectItem value="Growth Stage">Growth Stage</SelectItem>
                          <SelectItem value="Mature">Mature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-medium">Startup Name</Label>
                      <Input
                        id="companyName"
                        value={profileData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="Your startup name"
                      />
                    </div>


                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="companyWebsiteUrl" className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Startup Website URL
                      </Label>
                      <Input
                        id="companyWebsiteUrl"
                        value={profileData.companyWebsiteUrl}
                        onChange={(e) => handleInputChange('companyWebsiteUrl', e.target.value)}
                        className="transition-all duration-300 focus:scale-105"
                        placeholder="https://your-startup.com"
                      />
                    </div>
                  </div>


                  <div className="space-y-4">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Skills ({profileData.skills.length})
                    </Label>
                    <TagsInput
                      value={profileData.skills}
                      onChange={(tags: string[]) => handleInputChange('skills', tags)}
                      tagProps={{ className: 'react-tagsinput-tag bg-primary text-primary-foreground' }}
                      inputProps={{ placeholder: 'Add a skill' }}
                      className="react-tags-input"
                    />
                  </div>


                  <div className="space-y-4">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Interests ({profileData.interests.length})
                    </Label>
                    <TagsInput
                      value={profileData.interests}
                      onChange={(tags: string[]) => handleInputChange('interests', tags)}
                      tagProps={{ className: 'react-tagsinput-tag bg-secondary text-secondary-foreground' }}
                      inputProps={{ placeholder: 'Add an interest' }}
                      className="react-tags-input"
                    />
                  </div>


                  <Button
                    onClick={() => handleSave('professional')}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {isSaving ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" /> Save Professional Info</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>


          <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/10 to-purple-100/50 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Your profile is {getProfileCompletion()}% complete!</h3>
            <p className="text-muted-foreground mb-4">
              The more complete your profile, the better your chances of finding the right co-founder
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={() => setIsPreviewModalOpen(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              View My Profile
            </Button>
          </div>
        </div>
      </div>
     
      <MemberModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        member={myProfileForPreview}
        isMyProfile={true}
      />
    </DashboardLayout>
  );
};


export default EditProfilePage;
