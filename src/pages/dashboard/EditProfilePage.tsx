import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import DashboardLayout from '@/components/layouts/DashboardLayout'; // فرض بر استفاده از یک لایه‌بندی داشبورد
import { ProfileImageUploader } from '@/components/dashboard/ProfileImageUploader'; // Import the new component
import { getUserProfile, auth, updateUserProfile } from '@/lib/firebase'; // Import getUserProfile, auth, and updateUserProfile
import TagsInput from 'react-tagsinput'; // Import TagsInput
// Remove the import for the custom CSS file
// import './EditProfilePage.css'; // Import custom CSS for this page
import { useToast } from '@/hooks/use-toast'; // Import useToast hook
// import { useUser } from '@/contexts/UserContext'; // We are not using UserContext here anymore

const EditProfilePage: React.FC = () => {
  // Add state for userProfileImage
  const [userProfileImage, setUserProfileImage] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState(''); // Or undefined if no selection
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [personalSummary, setPersonalSummary] = useState(''); // Add state for personal summary
  const [isSavingPersonalSummary, setIsSavingPersonalSummary] = useState(false); // Add state for saving personal summary
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false); // New state for loading
  const [isSavingProfessionalInfo, setIsSavingProfessionalInfo] = useState(false); // Add state for saving professional info
  const { toast } = useToast(); // Initialize useToast

  const [role, setRole] = useState(''); // Add state for role
  const [lookingFor, setLookingFor] = useState(''); // Add state for lookingFor
  const [businessStage, setBusinessStage] = useState(''); // Add state for businessStage
  const [skills, setSkills] = useState<string[]>([]); // Add state for skills
  const [interests, setInterests] = useState<string[]>([]); // Add state for interests
  const [showInterestsTooltip, setShowInterestsTooltip] = useState(false); // Add state for interests tooltip visibility
  const [showSkillsTooltip, setShowSkillsTooltip] = useState(false); // Add state for skills tooltip visibility

  const urlPattern = /^(https?:\/\/).+$/; // Basic URL pattern check

  // Add useEffect to fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Start loading
      const userId = auth.currentUser?.uid; // Get current user's UID
      if (userId) {
        try {
          const profile = await getUserProfile(userId); // Fetch user profile
          if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setPronouns(profile.pronouns || '');
            setTagline(profile.tagline || '');
            setLocation(profile.location || '');
            setLinkedinUrl(profile.linkedinUrl || '');
            setTwitterUrl(profile.twitterUrl || '');
            setPersonalSummary(profile.personalSummary || '');
            setRole(profile.role || '');
            setLookingFor(profile.lookingFor || '');
            setBusinessStage(profile.businessStage || '');
            setSkills(profile.skills || []);
            setInterests(profile.interests || []);
            // Update userProfileImage state
            setUserProfileImage(profile.profileImageUrl);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast({ title: "Error", description: "Failed to fetch user profile.", variant: "destructive" });
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setLoading(false); // End loading if no user
      }
    };
    fetchUserProfile();
  }, []); // Run only once on mount

  // Add handleProfileImageUpdate function
  const handleProfileImageUpdate = (imageUrl: string) => {
    setUserProfileImage(imageUrl);
  };


  const handleSavePersonalInfo = async () => {
    setIsSavingPersonalInfo(true); // Start loading
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
      pronouns,
      tagline,
      location,
      linkedinUrl,
      twitterUrl,
    };

    try {
      await updateUserProfile(userId, personalInfoData);
      toast({
        title: "Success",
        description: "Personal information updated successfully.",
      });
    } catch (error) {
      console.error('Error saving personal information:', error);
      toast({ title: "Error", description: "Failed to save personal information.", variant: "destructive" });
    } finally {
      setIsSavingPersonalInfo(false); // End loading
    }
  };

  const handleSavePersonalSummary = async () => {
    setIsSavingPersonalSummary(true); // Start loading
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setIsSavingPersonalSummary(false); // End loading
      return;
    }

    const personalSummaryData = {
      personalSummary,
    };

    try {
      await updateUserProfile(userId, personalSummaryData);
      toast({
        title: "Success",
        description: "Personal summary updated successfully.",
      });
    } catch (error) {
      console.error('Error saving personal summary:', error);
      toast({ title: "Error", description: "Failed to save personal summary.", variant: "destructive" });
    } finally { setIsSavingPersonalSummary(false); } // End loading
  };

  const handleSaveProfessionalInfo = async () => {
    setIsSavingProfessionalInfo(true); // Start loading
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setIsSavingProfessionalInfo(false); // End loading
      return;
    }

    const professionalInfoData = {
      role,
      lookingFor,
      businessStage,
      skills,
      interests,
    };

    console.log('Professional information data being saved:', professionalInfoData); // Log the data before saving
    console.log('Saving professional info:', professionalInfoData); // Log the data before saving
    try {
      await updateUserProfile(userId, professionalInfoData);
      toast({
        title: "Success",
        description: "Professional information updated successfully.",
      });
      // After successful save, refetch profile data to update the state
      const updatedProfile = await getUserProfile(userId);
      if (updatedProfile) {
 setSkills(updatedProfile.skills || []);
 setInterests(updatedProfile.interests || []);
      }

    } catch (error) {
      console.error('Error saving professional information:', error);
      toast({ title: "Error", description: "Failed to save professional information.", variant: "destructive" });
    } finally {
      setIsSavingProfessionalInfo(false); // End loading
    }
  };


  // You might want to show a loading indicator here while fetching profile data
  if (loading) {
      return (
      <DashboardLayout>
        <div className="container mx-auto py-8">Loading Profile...</div>
      </DashboardLayout>
      );
  }

  return (
    // DashboardLayout will get the userProfileImage from the UserContext
    <DashboardLayout> {/* استفاده از لایه‌بندی داشبورد */}
      <div className="container mx-auto p-4 md:p-8"> {/* Adjusted padding for mobile and desktop */} {/* Main container for the page content */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Profile</h1> {/* Adjusted heading size and margin */}
        <div className="mb-8"> {/* Added margin below the image uploader */}
            {/* Pass userProfileImage state to ProfileImageUploader */}
            <ProfileImageUploader userProfileImage={userProfileImage} userId={auth.currentUser?.uid || ''} onImageUpdate={handleProfileImageUpdate} /> {/* Pass state and userId to ProfileImageUploader */}
        </div>

        {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8"> {/* Added card styling */}
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Personal Information</h2> {/* Adjusted heading size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> {/* Adjusted gap */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label> {/* Adjusted margin */}
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label> {/* Adjusted margin */}
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              />
            </div>
            <div>
              <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label> {/* Adjusted margin */}
              <select
                id="pronouns"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)} // Update state on selection change
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              >
                <option value="">Select Pronouns</option> {/* Optional: add a default empty option */}
                <option value="She/Her">She/Her</option>
                <option value="He/Him">He/Him</option>
                <option value="They/Them">They/Them</option>
                <option value="Don't Want To Share">Don't Want To Share</option>
              </select>
            </div>
            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">Tagline</label> {/* Adjusted margin */}
              <input
                type="text"
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label> {/* Adjusted margin */}
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Start typing to search for a city"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              />
            </div>
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Url</label> {/* Adjusted margin */}
              <input
                type="text"
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              />
            </div>
            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">Twitter Url</label> {/* Adjusted margin */}
              <input
                type="text"
                id="twitterUrl"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              />
            </div>
          </div>
          {/* Save button for Personal Information */}
          <button
            className={`mt-6 px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSavingPersonalInfo ? 'opacity-50 cursor-not-allowed' : ''}`} // Updated button styling
            onClick={handleSavePersonalInfo}
            disabled={isSavingPersonalInfo} // Disable button while saving
          >
            {isSavingPersonalInfo ? 'Saving...' : 'Save Personal Information'} {/* Change button text while saving */}
          </button>
        </div>

        {/* Personal Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8"> {/* Added card styling */}
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Personal Summary</h2> {/* Adjusted heading size */}
          <div>
            <label htmlFor="personalSummary" className="block text-sm font-medium text-gray-700 mb-1">Personal Summary</label> {/* Adjusted margin */}
            <textarea
              id="personalSummary"
              rows={4} // Adjust rows as needed
              value={personalSummary}
              onChange={(e) => setPersonalSummary(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
            />
          </div>
          {/* Save button for Personal Summary */}
          <button
            className={`mt-6 px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSavingPersonalSummary ? 'opacity-50 cursor-not-allowed' : ''}`} // Updated button styling
            onClick={handleSavePersonalSummary}
            disabled={isSavingPersonalSummary} // Disable button while saving
          >
            {isSavingPersonalSummary ? 'Saving...' : 'Save Personal Summary'} {/* Change button text while saving */}
          </button>
        </div>

        {/* Professional Information Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8"> {/* Added card styling */}
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Professional Information</h2> {/* Adjusted heading size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> {/* Adjusted gap */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label> {/* Adjusted margin */}
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              >
                <option value="">Select Role</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Investor">Investor</option>
                <option value="Mentor">Mentor</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">Looking For</label> {/* Adjusted margin */}
              <select
                id="lookingFor"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              >
                <option value="">Select What You're Looking For</option>
                <option value="Co-founder">Co-founder</option>
                <option value="Investment">Investment</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Services">Services</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="businessStage" className="block text-sm font-medium text-gray-700 mb-1">Current Business Stage</label> {/* Adjusted margin */}
              <select
                id="businessStage"
                value={businessStage}
                onChange={(e) => setBusinessStage(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" // Added padding
              >
                <option value="">Select Business Stage</option>
                <option value="Idea Stage">Idea Stage</option>
                <option value="Prototype">Prototype</option>
                <option value="Early Traction">Early Traction</option>
                <option value="Scaling">Scaling</option>
                <option value="Established">Established</option>
              </select>
            </div>
            {/* Skills Input */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label> {/* Adjusted margin */}
              <div className="relative"> {/* Use Tailwind relative class */}
                <TagsInput
                  id="skills"
                  value={skills}
                  onChange={setSkills} // TagsInput provides the new array directly
                  // Modified className for better tag display and input padding
                  className="react-tagsinput border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm flex flex-wrap items-center px-2 py-1 min-h-[38px]" // Applied Tailwind classes for flex container
                  focusedClassName='react-tagsinput--focused' // Default class for focused state
                  tagProps={{
                    className: 'react-tagsinput-tag bg-black text-white rounded-md px-2 py-1 mr-1 my-0.5 text-sm inline-flex items-center', // Applied Tailwind classes for individual tags
                    classNameRemove: 'react-tagsinput-remove ml-1 cursor-pointer text-white hover:text-gray-100', // Applied Tailwind classes
                  }}
                  inputProps={{
                    className: 'react-tagsinput-input px-3 py-2 text-sm w-full', // Applied Tailwind classes
                    placeholder: 'Add skills by typing and pressing Enter or Tab',
                  }}
                  renderInput={({ addTag, ...inputProps }) => {
                    return (
                      // Modified className for input to take available space
                      <input type="text" className="react-tagsinput-input px-1 py-0.5 text-sm outline-none flex-grow min-w-[100px]" {...inputProps} placeholder="Add skills by typing and pressing Enter or Tab" /> // Ensure input itself has no default outline and grows
                    );
                  }}
                />
                <span
                  onClick={() => setShowSkillsTooltip(!showSkillsTooltip)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" // Applied Tailwind classes
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                {/* The tooltip div for skills */}
                {showSkillsTooltip && (
                  <div
                    className="absolute top-full left-0 mt-2 w-max rounded-md bg-gray-800 text-white text-xs px-3 py-2 shadow-lg z-20" // Applied Tailwind classes for tooltip
                  >
                    Add skills by typing and pressing Enter or Tab
                  </div>
                )}
              </div>
            </div>
            {/* Interests Input */}
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                Interests
              </label> {/* Adjusted margin */}
              <div className="relative"> {/* Use Tailwind relative class */}
                <TagsInput
                  id="interests"
                  // @ts-ignore // Ignore TypeScript error for now if needed
                  value={interests}
                  onChange={setInterests} // TagsInput provides the new array directly
                  // Modified className for better tag display and input padding
                  className="react-tagsinput border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm flex flex-wrap items-center px-2 py-1 min-h-[38px]" // Applied Tailwind classes for flex container
                   focusedClassName='react-tagsinput--focused' // Default class for focused state
                   tagProps={{
                     className: 'react-tagsinput-tag bg-black text-white rounded-md px-2 py-1 mr-1 my-0.5 text-sm inline-flex items-center', // Applied Tailwind classes for individual tags
                     classNameRemove: 'react-tagsinput-remove ml-1 cursor-pointer text-white hover:text-gray-100', // Applied Tailwind classes
                   }}
                   inputProps={{
                     className: 'react-tagsinput-input px-3 py-2 text-sm w-full', // Applied Tailwind classes
                     placeholder: 'Add interests by typing and pressing Enter or Tab',
                   }}
                   renderInput={({ addTag, ...inputProps }) => {
                     return (
                       // Modified className for input to take available space
                       <input type="text" className="react-tagsinput-input px-1 py-0.5 text-sm outline-none flex-grow min-w-[100px]" {...inputProps} placeholder="Add interests by typing and pressing Enter or Tab" /> // Ensure input itself has no default outline and grows
                     );
                   }}
                />
                <span
                  onClick={() => setShowInterestsTooltip(!showInterestsTooltip)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" // Applied Tailwind classes
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                {/* The tooltip div for interests */}
                {showInterestsTooltip && (
                  <div
                     className="absolute top-full left-0 mt-2 w-max rounded-md bg-gray-800 text-white text-xs px-3 py-2 shadow-lg z-20" // Applied Tailwind classes for tooltip
                   >
                     Add interests by typing and pressing Enter or Tab
                   </div>
                )}
              </div>
            </div>
          </div>
          {/* Save button for Professional Information */}
          <button
            className={`mt-6 px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSavingProfessionalInfo ? 'opacity-50 cursor-not-allowed' : ''}`} // Updated button styling
            onClick={handleSaveProfessionalInfo}
            disabled={isSavingProfessionalInfo} // Disable button while saving
          >
            {isSavingProfessionalInfo ? 'Saving...' : 'Save Professional Information'} {/* Change button text while saving */}
          </button>
        </div>
      </div>
    </DashboardLayout> // Close DashboardLayout
  );
};

export default EditProfilePage;