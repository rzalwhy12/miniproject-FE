'use client';
import React, { useState } from 'react';
import {
  User,
  Mail,
  Image,
  Phone,
  Banknote,
  Gift,
  Settings
} from 'lucide-react';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    gender: 'Male',
    bankName: 'BCA',
    accountNumber: '1234567890',
    accountHolder: 'John Doe'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    console.log('Data submitted:', formData);
    // TODO: connect ke API / Redux
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block w-24 h-24 mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-full h-full object-cover border-4 border-white shadow-md"
              />
              <label className="absolute bottom-0 right-0 bg-purple-500 p-1 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                <Image className="w-4 h-4 text-white" />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Edit Profile
            </h1>
            <p className="text-gray-600">Update your account information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Personal & Referral */}
            <div className="space-y-6">
              <Section
                title="Personal Information"
                icon={<User className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={['Male', 'Female', 'Other']}
                />
              </Section>

              <Section
                title="Referral Info"
                icon={<Gift className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <Field label="Referral Code" value="REF12345" />
                <Field label="Verified" value="✅ Yes" />
              </Section>
            </div>

            {/* Right Side: Contact & Bank */}
            <div className="space-y-6">
              <Section
                title="Contact Information"
                icon={<Mail className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value="+628123456789"
                  disabled
                />
              </Section>

              <Section
                title="Bank Account"
                icon={<Banknote className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <InputField
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Account Number"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Account Holder"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleInputChange}
                />
              </Section>

              <Section
                title="Actions"
                icon={<Settings className="w-5 h-5 text-purple-500 mr-3" />}
              >
                <button
                  onClick={handleSubmit}
                  className="w-full text-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Save Changes
                </button>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Wrapper
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

// Static Field
const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <p className="text-gray-900">{value}</p>
  </div>
);

// Editable Field
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled = false
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

// Select Field
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default ProfilePage;
