import { useState, useEffect } from "react";
import {
  Link,
  Download,
  ExternalLink,
  FileText,
  Video,
  Image,
  File,
  Loader2,
  AlertCircle,
  CheckCircle,
  Play,
  Eye,
  Copy,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";

// URL detection utilities
const detectContentType = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // Google Drive detection
    if (hostname.includes("drive.google.com")) {
      if (pathname.includes("/file/d/")) {
        return "google-drive-file";
      } else if (pathname.includes("/folders/")) {
        return "google-drive-folder";
      }
      return "google-drive";
    }

    // YouTube detection
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "youtube";
    }

    // Dropbox detection
    if (hostname.includes("dropbox.com")) {
      return "dropbox";
    }

    // Generic file detection by extension
    const fileExtension = pathname.split(".").pop()?.toLowerCase();
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf", "odt"];

    if (videoExtensions.includes(fileExtension)) return "video";
    if (imageExtensions.includes(fileExtension)) return "image";
    if (documentExtensions.includes(fileExtension)) return "document";

    return "unknown";
  } catch {
    return "invalid-url";
  }
};

// Content ingestion components
const GoogleDriveIngestion = ({ url, onLoad }) => {
  const [ingestionStep, setIngestionStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Connecting to Google Drive API...",
    "Authenticating credentials...",
    "Downloading document content...",
    "Processing document structure...",
    "Extracting metadata...",
    "Content successfully ingested!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIngestionStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Complete the final step after 2 seconds
          setTimeout(() => {
            setIsComplete(true);
            toast.success("Content successfully ingested!", {
              icon: "✅",
              duration: 3000,
            });
            onLoad && onLoad();
          }, 2000);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(timer);
  }, [url, onLoad, steps.length]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Google Drive Document</h3>
          <p className="text-sm text-gray-600">
            {isComplete
              ? "Content ingested successfully"
              : "Ingesting content..."}
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-blue-400 rounded-full mx-auto opacity-20 animate-ping"></div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index <= ingestionStep
                    ? index === ingestionStep
                      ? isComplete
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                      : "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < ingestionStep
                      ? "bg-green-500"
                      : index === ingestionStep
                      ? isComplete
                        ? "bg-green-500"
                        : "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  {index < ingestionStep ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : index === ingestionStep ? (
                    isComplete ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    )
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    index <= ingestionStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const YouTubeIngestion = ({ url, onLoad }) => {
  const [ingestionStep, setIngestionStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Connecting to YouTube API...",
    "Validating video URL...",
    "Extracting video metadata...",
    "Processing video information...",
    "Analyzing video content...",
    "Content successfully ingested!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIngestionStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Complete the final step after 2 seconds
          setTimeout(() => {
            setIsComplete(true);
            toast.success("Content successfully ingested!", {
              icon: "✅",
              duration: 3000,
            });
            onLoad && onLoad();
          }, 2000);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, [url, onLoad, steps.length]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">YouTube Video</h3>
          <p className="text-sm text-gray-600">
            {isComplete
              ? "Content ingested successfully"
              : "Ingesting content..."}
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-red-400 rounded-full mx-auto opacity-20 animate-ping"></div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index <= ingestionStep
                    ? index === ingestionStep
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < ingestionStep
                      ? "bg-green-500"
                      : index === ingestionStep
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                >
                  {index < ingestionStep ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : index === ingestionStep ? (
                    isComplete ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    )
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    index <= ingestionStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DropboxIngestion = ({ url, onLoad }) => {
  const [ingestionStep, setIngestionStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Connecting to Dropbox API...",
    "Authenticating access token...",
    "Locating file in Dropbox...",
    "Downloading file content...",
    "Processing file data...",
    "Content successfully ingested!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIngestionStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Complete the final step after 2 seconds
          setTimeout(() => {
            setIsComplete(true);
            toast.success("Content successfully ingested!", {
              icon: "✅",
              duration: 3000,
            });
            onLoad && onLoad();
          }, 2000);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [url, onLoad, steps.length]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <File className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Dropbox File</h3>
          <p className="text-sm text-gray-600">
            {isComplete
              ? "Content ingested successfully"
              : "Ingesting content..."}
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <File className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-blue-400 rounded-full mx-auto opacity-20 animate-ping"></div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index <= ingestionStep
                    ? index === ingestionStep
                      ? isComplete
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                      : "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < ingestionStep
                      ? "bg-green-500"
                      : index === ingestionStep
                      ? isComplete
                        ? "bg-green-500"
                        : "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  {index < ingestionStep ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : index === ingestionStep ? (
                    isComplete ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    )
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    index <= ingestionStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaIngestion = ({ url, type, onLoad }) => {
  const [ingestionStep, setIngestionStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const getSteps = () => {
    switch (type) {
      case "video":
        return [
          "Connecting to media server...",
          "Validating video file...",
          "Extracting video metadata...",
          "Processing video frames...",
          "Analyzing video content...",
          "Content successfully ingested!",
        ];
      case "image":
        return [
          "Connecting to media server...",
          "Validating image file...",
          "Extracting image metadata...",
          "Processing image data...",
          "Analyzing image content...",
          "Content successfully ingested!",
        ];
      case "document":
        return [
          "Connecting to document server...",
          "Validating document file...",
          "Extracting document text...",
          "Processing document structure...",
          "Analyzing document content...",
          "Content successfully ingested!",
        ];
      default:
        return [
          "Connecting to file server...",
          "Validating file format...",
          "Extracting file metadata...",
          "Processing file data...",
          "Analyzing file content...",
          "Content successfully ingested!",
        ];
    }
  };

  const steps = getSteps();

  useEffect(() => {
    const timer = setInterval(() => {
      setIngestionStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Complete the final step after 2 seconds
          setTimeout(() => {
            setIsComplete(true);
            toast.success("Content successfully ingested!", {
              icon: "✅",
              duration: 3000,
            });
            onLoad && onLoad();
          }, 2000);
          return prev;
        }
      });
    }, 750);

    return () => clearInterval(timer);
  }, [url, onLoad, steps.length]);

  const getIcon = () => {
    switch (type) {
      case "video":
        return Video;
      case "image":
        return Image;
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  const getColor = () => {
    switch (type) {
      case "video":
        return "bg-purple-100 text-purple-600";
      case "image":
        return "bg-green-100 text-green-600";
      case "document":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case "video":
        return "purple";
      case "image":
        return "green";
      case "document":
        return "orange";
      default:
        return "gray";
    }
  };

  const Icon = getIcon();
  const accentColor = getAccentColor();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColor()}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 capitalize">
            {type} File
          </h3>
          <p className="text-sm text-gray-600">
            {isComplete
              ? "Content ingested successfully"
              : "Ingesting content..."}
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div
              className={`w-24 h-24 bg-gradient-to-br from-${accentColor}-100 to-${accentColor}-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}
            >
              <Icon className={`w-12 h-12 text-${accentColor}-600`} />
            </div>
            <div
              className={`absolute inset-0 w-24 h-24 bg-${accentColor}-400 rounded-full mx-auto opacity-20 animate-ping`}
            ></div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index <= ingestionStep
                    ? index === ingestionStep
                      ? `bg-${accentColor}-50 border border-${accentColor}-200`
                      : "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < ingestionStep
                      ? "bg-green-500"
                      : index === ingestionStep
                      ? `bg-${accentColor}-500`
                      : "bg-gray-300"
                  }`}
                >
                  {index < ingestionStep ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : index === ingestionStep ? (
                    isComplete ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    )
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    index <= ingestionStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function KnowledgeSource() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedContent, setLoadedContent] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);

  const handleLoadContent = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      toast.error("Please enter a URL", {
        icon: "⚠️",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    setError("");

    // Show loading toast
    const loadingToast = toast.loading("Loading content...", {
      duration: 2000,
    });

    try {
      const detectedType = detectContentType(url);

      if (detectedType === "invalid-url") {
        setError("Please enter a valid URL");
        toast.error("Invalid URL format", {
          id: loadingToast,
          icon: "❌",
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      if (detectedType === "unknown") {
        setError(
          "Unsupported content type. Please use Google Drive, YouTube, Dropbox, or direct media files."
        );
        toast.error("Unsupported content type", {
          id: loadingToast,
          icon: "🚫",
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoadedContent({
        url,
        type: detectedType,
        timestamp: new Date().toISOString(),
      });

      // Save to recent URLs
      const newRecentUrls = [url, ...recentUrls.filter((u) => u !== url)].slice(
        0,
        5
      );
      setRecentUrls(newRecentUrls);
      localStorage.setItem(
        "content-integration-urls",
        JSON.stringify(newRecentUrls)
      );

      // Success toast with content type info
      const contentTypeEmoji = {
        "google-drive": "📁",
        "google-drive-file": "📄",
        "google-drive-folder": "📂",
        youtube: "🎥",
        dropbox: "📦",
        video: "🎬",
        image: "🖼️",
        document: "📄",
      };

      toast.success(`Content loaded successfully!`, {
        id: loadingToast,
        icon: contentTypeEmoji[detectedType] || "✅",
        duration: 3000,
      });
    } catch {
      setError("Failed to load content. Please try again.");
      toast.error("Failed to load content", {
        id: loadingToast,
        icon: "💥",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentPreview = () => {
    if (!loadedContent) return null;

    const { type, url: contentUrl } = loadedContent;

    switch (type) {
      case "google-drive":
      case "google-drive-file":
      case "google-drive-folder":
        return <GoogleDriveIngestion url={contentUrl} onLoad={() => {}} />;
      case "youtube":
        return <YouTubeIngestion url={contentUrl} onLoad={() => {}} />;
      case "dropbox":
        return <DropboxIngestion url={contentUrl} onLoad={() => {}} />;
      case "video":
      case "image":
      case "document":
        return (
          <MediaIngestion url={contentUrl} type={type} onLoad={() => {}} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Knowledge Source
          </h1>
          <p className="text-gray-600">
            Ingest and process content from Google Drive, YouTube, Dropbox, and
            other media sources with real-time progress tracking
          </p>
        </div>

        <div className="space-y-6">
          {/* URL Input Section - Compact at the top */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label
                  htmlFor="url-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content URL
                </label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (e.target.value === "" && url !== "") {
                      toast.info("URL cleared", {
                        icon: "🗑️",
                        duration: 1500,
                      });
                    }
                  }}
                  placeholder="https://drive.google.com/file/d/... or any supported URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyPress={(e) => e.key === "Enter" && handleLoadContent()}
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>
              <button
                onClick={handleLoadContent}
                disabled={isLoading || !url.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Load Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Preview Section - Takes full width with proper spacing */}
          <div className="min-h-[600px]">
            {loadedContent ? (
              <div className="h-full">{renderContentPreview()}</div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Share2 className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    No Content Ingested
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Enter a URL above to ingest and process content from
                    supported services like Google Drive, YouTube, Dropbox, and
                    direct media files with real-time progress tracking
                  </p>
                  <div className="flex justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📁</span>
                      <span>Google Drive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      <span>YouTube</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      <span>Dropbox</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <span>Direct Files</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
