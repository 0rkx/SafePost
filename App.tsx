import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { ErrorDisplay } from './components/ErrorDisplay';
import { makeImageSafe } from './services/geminiService';
import { fileToStrippedBase64 } from './utils/imageUtils';
import type { AppState } from './types';
import { AppStatus } from './types';
import { ImagePreview } from './components/ImagePreview';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ status: AppStatus.IDLE });

  const handleImageUpload = useCallback((file: File, preserveElements: string) => {
    const objectUrl = URL.createObjectURL(file);
    setAppState({
      status: AppStatus.PREVIEW,
      file,
      imageUrl: objectUrl,
      preserveElements,
    });
  }, []);
  

  const handleProcessImage = useCallback(async (finalPreserveElements: string) => {
    if (appState.status !== AppStatus.PREVIEW) return;

    const { file, imageUrl } = appState;
    
    setAppState({ status: AppStatus.PROCESSING, imageUrl, preserveElements: finalPreserveElements });

    try {
      const { base64, mimeType } = await fileToStrippedBase64(file);
      const safeImageBase64 = await makeImageSafe(base64, mimeType, finalPreserveElements);
      
      if (!safeImageBase64) {
        throw new Error("The AI did not return an image. It may not have found any sensitive content to edit.");
      }

      const safeImageUrl = `data:image/png;base64,${safeImageBase64}`;
      setAppState({ status: AppStatus.COMPLETE, originalUrl: imageUrl, safeImageUrl });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setAppState({ 
        status: AppStatus.ERROR, 
        message: errorMessage,
        file,
        imageUrl,
        preserveElements: finalPreserveElements
      });
    }
  }, [appState]);

  const handleRetry = useCallback(async () => {
    if (appState.status !== AppStatus.ERROR) return;

    const { file, imageUrl, preserveElements } = appState;
    
    setAppState({ status: AppStatus.PROCESSING, imageUrl, preserveElements });

    try {
      const { base64, mimeType } = await fileToStrippedBase64(file);
      const safeImageBase64 = await makeImageSafe(base64, mimeType, preserveElements);
      
      if (!safeImageBase64) {
        throw new Error("The AI did not return an image. It may not have found any sensitive content to edit.");
      }

      const safeImageUrl = `data:image/png;base64,${safeImageBase64}`;
      setAppState({ status: AppStatus.COMPLETE, originalUrl: imageUrl, safeImageUrl });
    } catch (error) {
      console.error("Retry failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during retry.";
      setAppState({ 
        status: AppStatus.ERROR, 
        message: `Retry failed: ${errorMessage}`,
        file,
        imageUrl,
        preserveElements,
      });
    }
  }, [appState]);

  const handleReset = () => {
    if (appState.status === AppStatus.PREVIEW) {
      URL.revokeObjectURL(appState.imageUrl);
    } else if (appState.status === AppStatus.COMPLETE) {
      URL.revokeObjectURL(appState.originalUrl);
    } else if (appState.status === AppStatus.ERROR) {
      URL.revokeObjectURL(appState.imageUrl);
    }
    setAppState({ status: AppStatus.IDLE });
  };

  const renderContent = () => {
    switch (appState.status) {
      case AppStatus.IDLE:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppStatus.PREVIEW:
        return (
          <ImagePreview
            imageUrl={appState.imageUrl}
            preserveElements={appState.preserveElements}
            onProcess={handleProcessImage}
            onCancel={handleReset}
          />
        );
      case AppStatus.PROCESSING:
        return <Loader imageUrl={appState.imageUrl} preserveElements={appState.preserveElements} />;
      case AppStatus.COMPLETE:
        return (
          <ImageDisplay
            originalUrl={appState.originalUrl}
            safeUrl={appState.safeImageUrl}
            onReset={handleReset}
          />
        );
      case AppStatus.ERROR:
        return <ErrorDisplay message={appState.message} onReset={handleReset} onRetry={handleRetry} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;