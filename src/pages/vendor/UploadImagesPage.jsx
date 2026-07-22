import { useAuth } from '../../context/AuthContext';
import VendorImageUploader from '../../components/VendorImageUploader';

export default function UploadImagesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Upload Images</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Add photos of your outlet, dishes or work to showcase on your profile.
          </p>
        </div>

        <VendorImageUploader vendorId={user?.id} />
      </div>
    </div>
  );
}
