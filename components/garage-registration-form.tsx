"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Import step components
import GarageInfoStep from "./form-steps/garage-info-step"
import AboutGarageStep from "./form-steps/about-garage-step"
import AvailableBrandsStep from "./form-steps/available-brands-step"
import StaffDetailsStep from "./form-steps/staff-details-step"
import PickAndDropStep from "./form-steps/pick-and-drop-step"
import PaymentAndServicesStep from "./form-steps/payment-and-services-step"

export default function GarageRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [fluids, setFluids] = useState([{ id: 1 }])
  const [staffMembers, setStaffMembers] = useState([{ id: 1 }])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Create refs for all form steps
  const formRefs = useRef<{
    garageInfo: any | null;
    aboutGarage: any | null;
    availableBrands: any | null;
  }>({
    garageInfo: null,
    aboutGarage: null,
    availableBrands: null,
  })

  const steps = [
    { title: "Garage Info", component: <GarageInfoStep ref={el => formRefs.current.garageInfo = el} /> },
    { title: "About Garage", component: <AboutGarageStep ref={el => formRefs.current.aboutGarage = el} /> },
    { title: "Available Brands", component: <AvailableBrandsStep fluids={fluids} setFluids={setFluids} ref={el => formRefs.current.availableBrands = el} /> },
    {
      title: "Staff Details",
      component: <StaffDetailsStep staffMembers={staffMembers} setStaffMembers={setStaffMembers} />,
    },
    { title: "Pick & Drop", component: <PickAndDropStep /> },
    { title: "Payment & Services", component: <PaymentAndServicesStep /> },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError("")

      // Collect all form data
      const formData = collectFormData()
      
      // Google Script deployment URL
      // Replace with your actual deployed Google Apps Script web app URL
      const scriptUrl = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"

      // Send data to Google Sheet
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'no-cors' // Required for Google Script
      })

      // Show success popup
      setShowSuccessPopup(true)
      
      // Set a timer to mark the form as completed after the popup is shown
      setTimeout(() => {
        setIsCompleted(true)
        setShowSuccessPopup(false)
      }, 3000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An error occurred while submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const collectFormData = () => {
    // Step 1: Collect garage info data using ref
    const garageInfoData = formRefs.current.garageInfo?.getFormData() || {}
    
    // Step 2: Collect about garage data using ref
    const aboutGarageData = formRefs.current.aboutGarage?.getFormData() || {}
    
    // Step 3: Collect available brands data using ref
    const availableBrandsData = formRefs.current.availableBrands?.getFormData() || {}
    
    // Step 4: Collect staff details data
    const staffDetailsData = {}
    staffMembers.forEach((staff, index) => {
      const staffForm = document.getElementById("staffDetails") as HTMLFormElement
      if (staffForm) {
        const formData = new FormData(staffForm)
        for (let [key, value] of formData.entries()) {
          if (key.includes(`staffName-${staff.id}`)) staffDetailsData[`staff${index+1}Name`] = value
          if (key.includes(`staffPhone-${staff.id}`)) staffDetailsData[`staff${index+1}Phone`] = value
          if (key.includes(`specialist-${staff.id}`)) staffDetailsData[`staff${index+1}Specialist`] = value
          if (key.includes(`photoLink-${staff.id}`)) staffDetailsData[`staff${index+1}PhotoLink`] = value
          if (key.includes(`notes-${staff.id}`)) staffDetailsData[`staff${index+1}Notes`] = value
        }
      }
    })
    
    // Step 5: Collect pick and drop data
    const pickDropForm = document.getElementById("pickAndDrop") as HTMLFormElement
    const pickDropData = pickDropForm ? Object.fromEntries(new FormData(pickDropForm).entries()) : {}
    
    // Step 6: Collect payment and services data
    const paymentServicesForm = document.getElementById("paymentAndServices") as HTMLFormElement
    const paymentServicesData = paymentServicesForm ? Object.fromEntries(new FormData(paymentServicesForm).entries()) : {}
    
    // Combine all data
    const allFormData = {
      ...garageInfoData,
      ...aboutGarageData,
      ...availableBrandsData,
      ...staffDetailsData,
      ...pickDropData,
      ...paymentServicesData,
      timestamp: new Date().toISOString(),
      fluidCount: fluids.length,
      staffCount: staffMembers.length
    }

    return allFormData
  }

  return (
    <div className="max-w-3xl mx-auto relative py-8 px-4">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative animate-fade-in-up">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4">
                <Image src="/images/logo.png" alt="MechHelp Logo" width={64} height={64} className="object-contain" />
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h3>
              <p className="text-gray-600">
                Your garage partner registration has been submitted. We'll review your information shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Completed State with Register Another Option */}
      {isCompleted && (
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6">
            <Image src="/images/logo.png" alt="MechHelp Logo" width={96} height={96} className="object-contain" />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Registration Successful!</h2>
            <p className="text-green-600 mb-6">Your garage partner registration has been submitted successfully.</p>
            <p className="mt-6 text-sm text-gray-600">
              Our team will review your application and get back to you shortly.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="px-6 brand-gradient text-white brand-shadow">
            Register Another Garage
          </Button>
        </div>
      )}

      {/* Form Content - Only show if not completed */}
      {!isCompleted && (
        <>
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 mr-4">
              <Image src="/images/logo.png" alt="MechHelp Logo" width={80} height={80} className="object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Garage Partner Registration</h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={cn("h-2 w-16 rounded-full", index <= currentStep ? "brand-gradient" : "bg-gray-200")} />
              </div>
            ))}
          </div>

          {/* Step Title */}
          <h2 className="text-center text-primary font-semibold mb-8">{steps[currentStep].title}</h2>

          {/* Step Content */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {steps[currentStep].component}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center border-primary text-primary"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="flex items-center brand-gradient text-white brand-shadow">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="brand-gradient text-white brand-shadow flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}