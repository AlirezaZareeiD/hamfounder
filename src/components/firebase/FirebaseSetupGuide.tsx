
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FirebaseSetupGuideProps {
  onClose?: () => void;
}

export const FirebaseSetupGuide = ({ onClose }: FirebaseSetupGuideProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Firebase Authentication Setup Guide</CardTitle>
            <CardDescription className="mt-2">
              Follow these steps to configure Firebase for social authentication
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Your Firebase configuration is incomplete. Please follow this guide to set up authentication properly.
          </AlertDescription>
        </Alert>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">1. Create a Firebase Project</h3>
          <ol className="list-decimal list-inside space-y-2 pl-4 text-slate-700">
            <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 inline-flex items-center">Firebase Console <ExternalLink className="ml-1 h-3 w-3" /></a></li>
            <li>Click "Add project" and follow the setup wizard</li>
            <li>Once created, click "Web" (the &lt;/&gt; icon) to register your web app</li>
            <li>Copy the provided Firebase config object</li>
            <li>Replace the placeholder config in <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">src/lib/firebase.ts</code></li>
          </ol>
        </div>
        
        <Tabs defaultValue="google">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="apple">Apple</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Google Authentication Setup</CardTitle>
                <CardDescription>Enable Google Sign-in in Firebase</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3 pl-4 text-slate-700">
                  <li>In the Firebase console, navigate to <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
                  <li>Enable the Google provider</li>
                  <li>Add your authorized domains:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Add <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">localhost</code> for development</li>
                      <li>Add your production domain</li>
                    </ul>
                  </li>
                  <li>Configure the OAuth consent screen in Google Cloud Console:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Set app name, user support email, and developer contact info</li>
                      <li>Add required scopes (email, profile)</li>
                    </ul>
                  </li>
                  <li>Save your changes</li>
                </ol>
              </CardContent>
              <CardFooter className="bg-slate-50 flex items-center">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Simplest to implement with highest success rate</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="apple">
            <Card>
              <CardHeader>
                <CardTitle>Apple Authentication Setup</CardTitle>
                <CardDescription>Enable Apple Sign-in in Firebase</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3 pl-4 text-slate-700">
                  <li>You need an Apple Developer account ($99/year)</li>
                  <li>In the Apple Developer console:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Register your app with an App ID</li>
                      <li>Enable "Sign in with Apple" capability</li>
                      <li>Create a Services ID (for web authentication)</li>
                      <li>Configure domains and redirect URLs</li>
                    </ul>
                  </li>
                  <li>Create a private key for your Apple Services ID</li>
                  <li>In Firebase console, navigate to <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
                  <li>Enable the Apple provider</li>
                  <li>Enter your Services ID, Team ID, Key ID, and private key</li>
                  <li>Configure OAuth code flow</li>
                </ol>
              </CardContent>
              <CardFooter className="bg-slate-50">
                <Alert className="border-amber-100 bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Requires Apple Developer Program membership and complex setup
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Authentication Setup</CardTitle>
                <CardDescription>Enable LinkedIn Sign-in in Firebase</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3 pl-4 text-slate-700">
                  <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 inline-flex items-center">LinkedIn Developers <ExternalLink className="ml-1 h-3 w-3" /></a></li>
                  <li>Create a new app</li>
                  <li>Under Auth tab, add OAuth 2.0 redirect URLs:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Add Firebase redirect URL: <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">https://&lt;YOUR-PROJECT-ID&gt;.firebaseapp.com/__/auth/handler</code></li>
                      <li>Add localhost version for testing</li>
                    </ul>
                  </li>
                  <li>Request application permissions:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>r_emailaddress</li>
                      <li>r_liteprofile</li>
                    </ul>
                  </li>
                  <li>In Firebase console, navigate to <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
                  <li>Enable the LinkedIn provider</li>
                  <li>Enter your Client ID and Client Secret from LinkedIn</li>
                </ol>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>Note:</strong> LinkedIn login via Firebase requires an OAuth 2.0 authentication flow. After recent changes by LinkedIn, additional setup may be required.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50">
                <Alert className="border-amber-100 bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Requires LinkedIn application review process for production use
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-lg mb-4">Common Issues & Solutions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-base">Popup Blocked</h4>
              <p className="text-slate-700">If sign-in popups are being blocked, ensure your site doesn't have popup blockers enabled and that Firebase is properly initialized before the auth calls.</p>
            </div>
            <div>
              <h4 className="font-medium text-base">Unauthorized Domain</h4>
              <p className="text-slate-700">Add all your domains (including localhost for development) to Firebase's authorized domains list in the Authentication section.</p>
            </div>
            <div>
              <h4 className="font-medium text-base">Configuration Errors</h4>
              <p className="text-slate-700">Double-check the Firebase config object in <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">src/lib/firebase.ts</code>. All values must match exactly what's provided in your Firebase console.</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">For more detailed information, visit the <a href="https://firebase.google.com/docs/auth" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 inline-flex items-center">Firebase Authentication docs <ExternalLink className="ml-1 h-3 w-3" /></a>.</p>
      </CardFooter>
    </Card>
  );
};
