import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext.jsx';
import { createCompany } from '../../services/db.js';
import { uploadCertificate } from '../../services/storage.js';
import { FaTimes, FaMapMarkerAlt, FaImage } from 'react-icons/fa';

const CompanySchema = Yup.object().shape({
  name: Yup.string()
    .required('Company name is required')
    .min(3, 'Name must be at least 3 characters'),
  since: Yup.string().required('Since year is required'),
  timings: Yup.string().required('Timings are required'),
  address: Yup.object().shape({
    name: Yup.string().required('Address name is required'),
    lat: Yup.number().required('Latitude is required'),
    lng: Yup.number().required('Longitude is required'),
  }),
});

export const CompanyCreationModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleCertificateAdd = (e) => {
    const files = Array.from(e.target.files);
    if (certificates.length + files.length > 3) {
      alert('Maximum 3 certificates allowed');
      return;
    }
    setCertificates([...certificates, ...files]);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setUploading(true);

      // Upload certificates
      const certificateUrls = [];
      for (const cert of certificates) {
        const url = await uploadCertificate(cert, user.uid);
        certificateUrls.push(url);
      }

      // Create company
      const companyData = {
        ownerId: user.uid,
        name: values.name,
        since: values.since,
        timings: values.timings,
        address: selectedLocation || values.address,
        certificates: certificateUrls,
      };

      await createCompany(companyData);
      alert('Company created successfully!');
      onSuccess?.();
      onClose();
      setCertificates([]);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company');
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">Create Company</h2>
          <button
            onClick={onClose}
            className="hover:bg-indigo-700 p-2 rounded-full transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={{
            name: '',
            since: new Date().getFullYear().toString(),
            timings: '',
            address: { name: '', lat: 0, lng: 0 },
          }}
          validationSchema={CompanySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="p-6 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Company Name
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter company name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Since Year */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Since (Year)
                </label>
                <Field
                  name="since"
                  type="number"
                  placeholder="e.g., 2020"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="since" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Timings */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Timings
                </label>
                <Field
                  name="timings"
                  type="text"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="timings" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Address Picker */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt /> Address
                </label>
                {selectedLocation ? (
                  <div className="bg-green-50 border border-green-300 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-gray-700">{selectedLocation.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLocation(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-2">Manual address entry (Foursquare API integration for search coming soon)</p>
                )}
                <input
                  type="text"
                  placeholder="Location name"
                  value={selectedLocation?.name || ''}
                  onChange={(e) => setSelectedLocation({ ...selectedLocation, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaImage /> Certificates (Max 3)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleCertificateAdd}
                  disabled={certificates.length >= 3}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
                <div className="mt-3 space-y-2">
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm text-gray-700">{cert.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting || uploading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {uploading ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompanyCreationModal;
