const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-400 mb-4">Last updated: June 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">What data we collect</h2>
      <p className="text-gray-300">
        We collect information you provide directly (such as contact form submissions)
        and usage data through analytics tools to improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">How we use your data</h2>
      <p className="text-gray-300">
        Your data is used solely to respond to your inquiries and improve 
        the performance of our website. We do not sell your data to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Third party services</h2>
      <p className="text-gray-300">
        We use Supabase for data storage and EmailJS for contact form delivery.
        These services have their own privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact us</h2>
      <p className="text-gray-300">
        For any privacy concerns, contact us at your email or through our contact page.
      </p>
    </div>
  )
}

export default PrivacyPolicy