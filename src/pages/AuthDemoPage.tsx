import React from 'react';
import {
  SignIn,
  SignUp,
  GoogleOneTap,
  UserButton,
  UserProfile,
  CreateOrganization,
  OrganizationProfile,
  OrganizationSwitcher,
  OrganizationList,
  Waitlist
} from '@clerk/clerk-react';

const AuthDemoPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24 }}>
      <h1 className="text-2xl font-bold mb-4">Clerk Auth Components Demo</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sign In</h2>
        <SignIn />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
        <SignUp />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Google One Tap</h2>
        <GoogleOneTap />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Button</h2>
        <UserButton />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Profile</h2>
        <UserProfile />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Organization</h2>
        <CreateOrganization />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Organization Profile</h2>
        <OrganizationProfile />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Organization Switcher</h2>
        <OrganizationSwitcher />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Organization List</h2>
        <OrganizationList />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Waitlist</h2>
        <Waitlist />
      </div>
    </div>
  );
};

export default AuthDemoPage; 