import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ProfileImageUploader } from '@/components/dashboard/ProfileImageUploader';
import { getUserProfile, auth, updateUserProfile } from '@/lib/firebase';
import TagsInput from 'react-tagsinput';
// Removed unused CSS import
// import './EditProfilePage.css';
import { useToast } from '@/hooks/use-toast';
// Removed unused UserContext import
// import { useUser } from '@/contexts/UserContext';

const EditProfilePage: React.FC = () => {
  // State for user profile image and Your Startup Logo URL
  const [userProfileImage, setUserProfileImage] = useState<string | undefined>(undefined);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | undefined>(undefined);

  // Loading states for different sections
  const [loading, setLoading] = useState(true);
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);
  const [isSavingPersonalSummary, setIsSavingPersonalSummary] = useState(false);
  const [isSavingProfessionalInfo, setIsSavingProfessionalInfo] = useState(false);
  // isSavingCompanyLogo state is now likely managed within ProfileImageUploader when type="companyLogo"
  // const [isSavingCompanyLogo, setIsSavingCompanyLogo] = useState(false);

  // Founder Profile states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState(''); // Added displayName state
  const [pronouns, setPronouns] = useState('');
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [personalSummary, setPersonalSummary] = useState('');

  // Professional Background states
  const [role, setRole] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [businessStage, setBusinessStage] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState('');

  // Tooltip states for TagsInput
  const [showSkillsTooltip, setShowSkillsTooltip] = useState(false);
  const [showInterestsTooltip, setShowInterestsTooltip] = useState(false);

  const urlPattern = /^(https?:\/\/).+$/; // Basic URL pattern check

  // Initialize useToast hook
  const { toast } = useToast();

  // useEffect to fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          const profile = await getUserProfile(userId);
          if (profile) {
            // Populate Founder Profile states
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setDisplayName(profile.displayName || ''); // Populate displayName state
            setPronouns(profile.pronouns || '');
            setTagline(profile.tagline || '');
            setLocation(profile.location || '');
            setLinkedinUrl(profile.linkedinUrl || '');
            setTwitterUrl(profile.twitterUrl || '');
            setPersonalSummary(profile.personalSummary || '');

            // Populate Professional Background states
            setRole(profile.role || '');
            setLookingFor(profile.lookingFor || '');
            setBusinessStage(profile.businessStage || '');
            setSkills(profile.skills || []);
            setInterests(profile.interests || []);
            setCompanyName(profile.companyName || '');
            setCompanyWebsiteUrl(profile.companyWebsiteUrl || '');

            // Populate image URLs
            setUserProfileImage(profile.profileImageUrl || undefined);
            setCompanyLogoUrl(profile.companyLogoUrl || undefined);

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

  // Handlers for image updates from ProfileImageUploader
  // These functions are called by ProfileImageUploader after successful upload and database update
  const handleProfileImageUpdate = (imageUrl: string) => {
    setUserProfileImage(imageUrl); // Update the state for the profile image URL
  };

  const handleCompanyLogoUpdate = (imageUrl: string) => {
    setCompanyLogoUrl(imageUrl); // Update the state for the Your Startup Logo URL
  };

  // Handlers for saving different sections
  const handleSavePersonalInfo = async () => {
    setIsSavingPersonalInfo(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
        setIsSavingPersonalInfo(false);
        return;
    }

    // Basic URL validation
    if (linkedinUrl && !urlPattern.test(linkedinUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn URL (starting with http:// or https://)",
        variant: "destructive",
      });
      setIsSavingPersonalInfo(false);
      return;
    }
    if (twitterUrl && !urlPattern.test(twitterUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Twitter URL (starting with http:// or https://)",
        variant: "destructive",
      });
      setIsSavingPersonalInfo(false);
      return;
    }

    const personalInfoData = {
      firstName,
      lastName,
      displayName, // Added displayName to the data being saved
      pronouns,
      tagline,
      location,
      linkedinUrl,
      twitterUrl,
      // profileImageUrl is now handled by ProfileImageUploader directly
    };

    try {
      await updateUserProfile(userId, personalInfoData);
      toast({
        title: "Success",
        description: "Founder Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error saving Founder Profile:', error);
      toast({ title: "Error", description: "Failed to save Founder Profile.", variant: "destructive" });
    } finally {
      setIsSavingPersonalInfo(false);
    }
  };

  const handleSavePersonalSummary = async () => {
    setIsSavingPersonalSummary(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setIsSavingPersonalSummary(false);
      return;
    }

    const personalSummaryData = {
      personalSummary,
    };

    try {
      await updateUserProfile(userId, personalSummaryData);
      toast({
        title: "Success",
        description: "My Entrepreneurial Journey updated successfully.",
      });
    } catch (error) {
      console.error('Error saving My Entrepreneurial Journey:', error);
      toast({ title: "Error", description: "Failed to save My Entrepreneurial Journey.", variant: "destructive" });
    } finally { setIsSavingPersonalSummary(false); }
  };

  const handleSaveProfessionalInfo = async () => {
    setIsSavingProfessionalInfo(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setIsSavingProfessionalInfo(false);
      return;
    }

     // Basic URL validation for Startup website URL
     if (companyWebsiteUrl && !urlPattern.test(companyWebsiteUrl)) {
        toast({
            title: "Invalid URL",
            description: "Please enter a valid Startup Website URL (starting with http:// or https://)",
            variant: "destructive",
        });
        setIsSavingProfessionalInfo(false);
        return;
     }


    const professionalInfoData = {
      role,
      lookingFor,
      businessStage,
      skills,
      interests,
      companyName,
      // companyLogoUrl is now handled by ProfileImageUploader directly
      companyWebsiteUrl,
    };

    console.log('Professional Background data being saved:', professionalInfoData);
    try {
      await updateUserProfile(userId, professionalInfoData);
      toast({
        title: "Success",
        description: "Professional Background updated successfully.",
      });
       // After successful save, refetch profile data to update the state if needed (e.g., for skills/interests)
       // However, since state is updated directly by input changes, refetching might not be strictly necessary unless server-side processing affects these fields.
       // Leaving the refetch logic here just in case, but it might be redundant now.
       const updatedProfile = await getUserProfile(userId);

       if (updatedProfile) {
           setSkills(updatedProfile.skills || []);
           setInterests(updatedProfile.interests || []);
       }


    } catch (error) {
      console.error('Error saving Professional Background:', error);
      toast({ title: "Error", description: "Failed to save Professional Background.", variant: "destructive" });
    } finally {
      setIsSavingProfessionalInfo(false);
    }
  };

  // Show loading indicator while fetching initial profile data
  if (loading) {
      return (
      <DashboardLayout>
        <div className="container mx-auto py-8 text-center">Loading Profile...</div>
      </DashboardLayout>
      );
  }
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Customize Your Profile</h1>

        {/* Profile Image Uploader Section */}
        <div className="mb-8">
            {/* Pass userProfileImage state and set type="profile" */}
            <ProfileImageUploader
              userProfileImage={userProfileImage} // Pass the current user profile image URL
              userId={auth.currentUser?.uid || ''}
              onImageUpdate={handleProfileImageUpdate} // Callback to update userProfileImage state
              type="profile" // <-- Specify that this is for the user's profile image
            />
        </div>

        {/* Founder Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Founder Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
            {/* Your Public Identity - Added new input field */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Your Public Identity</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                placeholder="e.g. John Doe or Your Startup Name" // Added a placeholder for guidance
              />
            </div>
            {/* Pronouns */}
            <div>
              <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
              <select
                id="pronouns"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              >
                <option value="">Select Pronouns</option>
                <option value="She/Her">She/Her</option>
                <option value="He/Him">He/Him</option>
                <option value="They/Them">They/Them</option>
                <option value="Don't Want To Share">Don't Want To Share</option>
              </select>
            </div>
            {/* Tagline */}
            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Start typing to search for a city"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Url</label>
              <input
                type="text"
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
            {/* Twitter URL */}
            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">Twitter Url</label>
              <input
                type="text"
                id="twitterUrl"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSavePersonalInfo}
              disabled={isSavingPersonalInfo}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
              {isSavingPersonalInfo ? 'Saving...' : 'Save Personal Info'}
            </button>
          </div>
        </div>

        {/* My Entrepreneurial Journey Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">My Entrepreneurial Journey</h2>
          <div>
            <label htmlFor="My Entrepreneurial Journey" className="block text-sm font-medium text-gray-700 mb-1">Your story can inspire others — share what you've learned on your journey.</label>
            <textarea
              id="personalSummary"
              value={personalSummary}
              onChange={(e) => setPersonalSummary(e.target.value)}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSavePersonalSummary}
              disabled={isSavingPersonalSummary}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
              {isSavingPersonalSummary ? 'Saving...' : 'Save My Entrepreneurial Journey'}
            </button>
          </div>
        </div>


        {/* Professional Background Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Professional Background</h2>
           {/* Your Startup Logo Uploader Section */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Startup Logo</h3>
                {/* Pass companyLogoUrl state and set type="companyLogo" */}
                <ProfileImageUploader
                  userProfileImage={companyLogoUrl} // Pass the current Your Startup Logo URL
                  userId={auth.currentUser?.uid || ''}
                  onImageUpdate={handleCompanyLogoUpdate} // Callback to update companyLogoUrl state
                  type="companyLogo" // <-- Specify that this is for the Your Startup Logo
                />
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
            {/* Looking For */}
            <div>
              <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
              <select
                id="lookingFor"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              >
                <option value="">Select What You're Looking For</option>
                <option value="Co-founder">Co-founder</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Investment">Investment</option>
                <option value="Talent">Talent</option>
                <option value="Networking">Networking</option>
                <option value="Advisory">Advisory</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>
             {/* Business Stage */}
            <div>
              <label htmlFor="businessStage" className="block text-sm font-medium text-gray-700 mb-1">Business Stage</label>
               <select
                id="businessStage"
                value={businessStage}
                onChange={(e) => setBusinessStage(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              >
                <option value="">Select Business Stage</option>
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
                <option value="Early Stage">Early Stage</option>
                <option value="Growth Stage">Growth Stage</option>
                <option value="Mature">Mature</option>
              </select>
            </div>

             {/* Empty div for alignment in grid */}
            <div></div>

            {/* Skills */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills
                <span
                  className="ml-2 text-gray-400 cursor-pointer"
                  onMouseEnter={() => setShowSkillsTooltip(true)}
                  onMouseLeave={() => setShowSkillsTooltip(false)}
                  title="Add skills relevant to your expertise."
                >
                  (i)
                </span>
              </label>
               <TagsInput
                value={skills}
                onChange={setSkills}
                tagProps={{ className: 'react-tagsinput-tag bg-black text-white rounded px-2 py-1 mr-1 text-sm' }}
                inputProps={{ placeholder: 'Add a skill' }}
                className="react-tagsinput border border-gray-300 rounded-md p-2 w-full focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm"
              />
              {/* Tooltip */}
              {showSkillsTooltip && (
                <div className="mt-1 text-xs text-gray-500">Add skills relevant to your expertise. Press Enter after each skill.</div>
              )}
            </div>

             {/* Interests */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                Interests
                 <span
                  className="ml-2 text-gray-400 cursor-pointer"
                  onMouseEnter={() => setShowInterestsTooltip(true)}
                  onMouseLeave={() => setShowInterestsTooltip(false)}
                  title="Add your interests related to business, technology, or collaboration."
                >
                  (i)
                </span>
              </label>
               <TagsInput
                value={interests}
                onChange={setInterests}
                tagProps={{ className: 'react-tagsinput-tag bg-black text-white rounded px-2 py-1 mr-1 text-sm' }}
                inputProps={{ placeholder: 'Add an interest' }}
                 className="react-tagsinput border border-gray-300 rounded-md p-2 w-full focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm"
              />
                {/* Tooltip */}
              {showInterestsTooltip && (
                <div className="mt-1 text-xs text-gray-500">Add your interests related to business, technology, or collaboration. Press Enter after each interest.</div>
              )}
            </div>

             {/* Startup Name */}
             <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                />
             </div>
             {/* Startup Website URL */}
             <div>
                <label htmlFor="companyWebsiteUrl" className="block text-sm font-medium text-gray-700 mb-1">Startup Website URL</label>
                <input
                    type="text"
                    id="companyWebsiteUrl"
                    value={companyWebsiteUrl}
                    onChange={(e) => setCompanyWebsiteUrl(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
                />
             </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfessionalInfo}
              disabled={isSavingProfessionalInfo}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
              {isSavingProfessionalInfo ? 'Saving...' : 'Save Professional Info'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfilePage;
