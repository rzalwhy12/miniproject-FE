'use client';
import React from 'react';
import {
  User,
  Mail,
  Calendar,
  Settings,
  Image,
  Phone,
  Banknote,
  Gift
} from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block w-24 h-24 mb-4">
              <img
                src="/default-profile.png" // ganti dengan image profile user
                alt="Profile"
                className="rounded-full w-full h-full object-cover border-4 border-white shadow-md"
              />
              <label className="absolute bottom-0 right-0 bg-purple-500 p-1 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                <Image className="w-4 h-4 text-white" />
                <input type="file" className="hidden" />
              </label>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Profile Settings
            </h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <Section
                title="Personal Information"
                icon={<User className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <Field label="Full Name" value="John Doe" />
                <Field label="Username" value="@johndoe" />
                <Field label="Gender" value="Male" />
                <Field label="Birthdate" value="1999-01-01" />
              </Section>

              {/* Bank Info */}
              <Section
                title="Bank Account"
                icon={<Banknote className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <Field label="Bank Name" value="BCA" />
                <Field label="Account Number" value="1234567890" />
                <Field label="Account Holder" value="John Doe" />
              </Section>

              {/* Referral Info */}
              <Section
                title="Referral Info"
                icon={<Gift className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <Field label="Referral Code" value="REF12345" />
                <Field label="Verified" value="✅ Yes" />
              </Section>
            </div>

            {/* Contact & Account */}
            <div className="space-y-6">
              <Section
                title="Contact Information"
                icon={<Mail className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <Field label="Email" value="john@example.com" />
                <Field label="Phone Number" value="+628123456789" />
              </Section>

              <Section
                title="Account Status"
                icon={<Calendar className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <Field label="Status" value="🟢 Active" />
                <Field label="Member Since" value="2023-06-01" />
              </Section>

              <Section
                title="Quick Actions"
                icon={<Settings className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <div className="space-y-3">
                  <ActionButton label="Edit Profile" />
                  <ActionButton label="Change Password" />
                  <ActionButton label="Privacy Settings" />
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  icon,
  children
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <p className="text-gray-900">{value}</p>
  </div>
);

const ActionButton = ({ label }: { label: string }) => (
  <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    {label}
  </button>
);

export default ProfilePage;
