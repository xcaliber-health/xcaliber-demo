import { useState, useEffect, useCallback } from "react";
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
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";

// ====================================================================
// URL Detection Utility (Unchanged)
// ====================================================================

const detectContentType = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    if (hostname.includes("drive.google.com")) {
      if (pathname.includes("/file/d/")) {
        return "google-drive-file";
      } else if (pathname.includes("/folders/")) {
        return "google-drive-folder";
      }
      return "google-drive";
    }

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "youtube";
    }

    if (hostname.includes("dropbox.com")) {
      return "dropbox";
    }

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

// ====================================================================
// Tailwind Color Maps for dynamic class safety
// ====================================================================

const colorMap = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    bgStep: "bg-blue-50",
    bgDark: "bg-blue-500"
  },
  red: {
    bg: "bg-red-500",
    bgLight: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
    bgStep: "bg-red-50",
    bgDark: "bg-red-500"
  },
  indigo: {
    bg: "bg-indigo-500",
    bgLight: "bg-indigo-100",
    text: "text-indigo-600",
    border: "border-indigo-200",
    bgStep: "bg-indigo-50",
    bgDark: "bg-indigo-500"
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    bgStep: "bg-purple-50",
    bgDark: "bg-purple-500"
  },
  green: {
    bg: "bg-green-500",
    bgLight: "bg-green-100",
    text: "text-green-600",
    border: "border-green-200",
    bgStep: "bg-green-50",
    bgDark: "bg-green-500"
  },
  orange: {
    bg: "bg-orange-500",
    bgLight: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-200",
    bgStep: "bg-orange-50",
    bgDark: "bg-orange-500"
  },
  gray: {
    bg: "bg-gray-500",
    bgLight: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    bgStep: "bg-gray-50",
    bgDark: "bg-gray-500"
  },
};

// ====================================================================
// NEW: Common Progress Panel Component
// ====================================================================

const IngestionProgressPanel = ({ steps, ingestionStep, isComplete, accentColor, title, subtitle }) => {
  const color = colorMap[accentColor] || colorMap.gray;
  
  const IconMap = {
    blue: FileText,
    red: Video,
    indigo: File,
    purple: Video,
    green: Image,
    orange: FileText,
    gray: File,
  };
  const Icon = IconMap[accentColor] || File;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className={`w-10 h-10 ${color.bgLight} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            {isComplete ? "Content ingested successfully" : subtitle}
          </p>
        </div>
      </div>
      <div className="flex-1 p-6 space-y-3 overflow-y-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
              index <= ingestionStep
                ? index === ingestionStep
                  ? isComplete
                    ? "bg-green-50 border border-green-200"
                    : `${color.bgStep} ${color.border}`
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
                    : `${color.bgDark}`
                  : "bg-gray-300"
              }`}
            >
              {index < ingestionStep || (index === ingestionStep && isComplete) ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
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
  );
};


const getEmbedUrl = (url, type) => {
  if (!url) return null;

  switch (type) {
    case "youtube":
      // Convert https://www.youtube.com/watch?v=xyz → https://www.youtube.com/embed/xyz
      const videoId = url.split("v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;

    case "google-drive":
    case "google-drive-file":
      // Convert https://drive.google.com/file/d/FILE_ID/view → embed link
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const fileId = match ? match[1] : null;
      return fileId
        ? `https://drive.google.com/file/d/${fileId}/preview`
        : url;

    case "document":
      // For PDFs and documents
      return url;

    case "image":
      return url;

    case "video":
      return url;

    default:
      return null;
  }
};

// ====================================================================
// NEW: Common Preview Panel Component
// ====================================================================

const ContentPreviewPanel = ({ url, type, isComplete }) => {
    let Icon = FileText;
    let title = "Document Preview";
    let message = "Document content will be indexed and available for search.";
    let accentColorKey = "blue";
    
    switch (type) {
        case "google-drive":
        case "google-drive-file":
        case "document":
            Icon = FileText;
            title = "Document File";
            accentColorKey = "blue";
            break;
        case "youtube":
        case "video":
            Icon = Video;
            title = "Video Media";
            message = "Video content is being analyzed for transcripts and key frames.";
            accentColorKey = "red";
            break;
        case "image":
            Icon = Image;
            title = "Image File";
            message = "Image metadata and visual content analysis complete.";
            accentColorKey = "green";
            break;
        case "dropbox":
            Icon = File;
            title = "Cloud File";
            message = "File download complete. Ready for processing.";
            accentColorKey = "indigo";
            break;
        default:
            Icon = Eye;
            title = "Generic Web Link";
            accentColorKey = "gray";
            message = "Link detected. Ready for initial content extraction.";
    }

    const color = colorMap[accentColorKey] || colorMap.gray;

    return (
<div className="pt-4 pb-8 px-8 h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-r-xl">
  <h1 className="text-xl font-bold text-indigo-800 mb-1">
    {isComplete ? `${title} Ingested` : `Previewing ${title}`}
  </h1>
{isComplete ? (
  <div className="w-full mt-6 flex flex-col items-center">
    {(() => {
      const embedUrl = getEmbedUrl(url, type);

      if (type === "youtube") {
        return (
          <iframe
            src={embedUrl}
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full max-w-2xl h-80 rounded-xl shadow-lg"
          ></iframe>
        );
      }

      if (type === "google-drive" || type === "google-drive-file") {
        return (
          <iframe
            src={embedUrl}
            title="Google Drive Document"
            className="w-full max-w-2xl h-96 rounded-xl shadow-lg border"
          ></iframe>
        );
      }

      if (type === "document" && url.endsWith(".pdf")) {
        return (
          <iframe
            src={url}
            title="PDF Preview"
            className="w-full max-w-2xl h-96 rounded-xl shadow-lg border"
          ></iframe>
        );
      }

      if (type === "image") {
        return (
          <img
            src={url}
            alt="Preview"
            className="max-w-md rounded-lg shadow-lg"
          />
        );
      }

      if (type === "video") {
        return (
          <video
            controls
            src={url}
            className="w-full max-w-2xl rounded-xl shadow-lg"
          />
        );
      }

      return (
        <p className="text-gray-500 mt-4">No preview available for this content.</p>
      );
    })()}
  </div>
) : (
  <p className="text-gray-500 mt-4 text-center">
    {message}
  </p>
)}

        </div>
    );
};

// ====================================================================
// Ingestion Wrapper Components (Refactored for Layout)
// ====================================================================

const IngestionWrapper = ({ url, steps, title, subtitle, accentColorKey, onLoad }) => {
    const [ingestionStep, setIngestionStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIngestionStep((prev) => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsComplete(true);
                        toast.success("Content successfully ingested!", { icon: "✅", duration: 3000 });
                        onLoad && onLoad();
                    }, 2000);
                    return prev;
                }
            });
        }, 800);
        return () => clearInterval(timer);
    }, [url, onLoad, steps.length]);

    const detectedType = detectContentType(url);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-row divide-x divide-gray-200 overflow-hidden">
            {/* Left Panel: Progress Steps (Fixed width) */}
            <div className="w-1/3 min-w-[300px] max-w-[400px]">
                <IngestionProgressPanel
                    steps={steps}
                    ingestionStep={ingestionStep}
                    isComplete={isComplete}
                    accentColor={accentColorKey}
                    title={title}
                    subtitle={subtitle}
                />
            </div>
            {/* Right Panel: Content Preview (Flex grows) */}
            <div className="flex-1">
                <ContentPreviewPanel 
                    url={url} 
                    type={detectedType} 
                    isComplete={isComplete} 
                />
            </div>
        </div>
    );
};

// Wrapper Components
const GoogleDriveIngestion = (props) => (
    <IngestionWrapper
        {...props}
        steps={[
            "Connecting to Google Drive API...",
            "Authenticating credentials...",
            "Downloading document content...",
            "Processing document structure...",
            "Extracting metadata...",
            "Content successfully ingested!",
        ]}
        title="Google Drive Document"
        subtitle="Ingesting content..."
        accentColorKey="blue"
    />
);

const YouTubeIngestion = (props) => (
    <IngestionWrapper
        {...props}
        steps={[
            "Connecting to YouTube API...",
            "Validating video URL...",
            "Extracting video metadata...",
            "Processing video information...",
            "Analyzing video content...",
            "Content successfully ingested!",
        ]}
        title="YouTube Video"
        subtitle="Ingesting content..."
        accentColorKey="red"
    />
);

const DropboxIngestion = (props) => (
    <IngestionWrapper
        {...props}
        steps={[
            "Connecting to Dropbox API...",
            "Authenticating access token...",
            "Locating file in Dropbox...",
            "Downloading file content...",
            "Processing file data...",
            "Content successfully ingested!",
        ]}
        title="Dropbox File"
        subtitle="Ingesting content..."
        accentColorKey="indigo"
    />
);

const MediaIngestion = ({ type, ...props }) => {
    const getMediaDetails = () => {
        switch (type) {
            case "video":
                return { title: "Video File", color: "purple", steps: [ "Connecting...", "Validating...", "Extracting metadata...", "Processing frames...", "Analyzing content...", "Content successfully ingested!" ] };
            case "image":
                return { title: "Image File", color: "green", steps: [ "Connecting...", "Validating...", "Extracting metadata...", "Processing data...", "Analyzing content...", "Content successfully ingested!" ] };
            case "document":
                return { title: "Document File", color: "orange", steps: [ "Connecting...", "Validating...", "Extracting text...", "Processing structure...", "Analyzing content...", "Content successfully ingested!" ] };
            default:
                return { title: "Generic File", color: "gray", steps: [ "Connecting...", "Validating...", "Extracting metadata...", "Processing data...", "Analyzing content...", "Content successfully ingested!" ] };
        }
    };
    const details = getMediaDetails();
    return (
        <IngestionWrapper
            {...props}
            steps={details.steps}
            title={details.title}
            subtitle="Ingesting content..."
            accentColorKey={details.color}
        />
    );
};

// ====================================================================
// Initial Selection Screen (Refined for Color Map)
// ====================================================================

const InitialSelectionScreen = ({ onSelect }) => {
  const options = [
    { type: "google-drive", label: "Google Drive", icon: "📁", IconComponent: FileText, colorKey: "blue" },
    { type: "youtube", label: "YouTube", icon: "🎥", IconComponent: Video, colorKey: "red" },
    { type: "dropbox", label: "Dropbox", icon: "📦", IconComponent: File, colorKey: "indigo" },
    { type: "direct-file", label: "Direct File (URL)", icon: "📄", IconComponent: Download, colorKey: "green" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex items-center justify-center min-h-[600px] p-12">
      <div className="text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Select a Content Source to Ingest
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {options.map((option) => {
            const color = colorMap[option.colorKey];
            return (
                <button
                key={option.type}
                onClick={() => onSelect(option.type)}
                className={`group flex flex-col items-center p-6 rounded-xl border-2 border-transparent hover:border-indigo-400 transition-all duration-200 shadow-sm hover:shadow-lg bg-gray-50 hover:bg-indigo-50/50`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${color.bgLight}`}>
                  <option.IconComponent className={`w-8 h-8 ${color.text}`} />
                </div>
                <span className="text-lg font-medium text-gray-800">
                  {option.label}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {option.icon} Link
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-sm text-gray-500 mt-12">
          Clicking a source will take you to the URL input section.
        </p>
      </div>
    </div>
  );
};


// ====================================================================
// MODIFIED MAIN COMPONENT: KnowledgeSource
// ====================================================================

export default function KnowledgeSource() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedContent, setLoadedContent] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [placeholderUrl, setPlaceholderUrl] = useState("");
  const [ingestionMode, setIngestionMode] = useState('select');

  const handleSelectSource = useCallback((sourceType) => {
      setIngestionMode('input');
      setLoadedContent(null);
      setError("");
      setUrl(""); // ⬅️ CRITICAL FIX: Ensure the actual URL is CLEARED!
      
      // 💡 MODIFIED LOGIC: Set the hint in the new placeholder state.
      if (sourceType === 'google-drive') {
        setPlaceholderUrl("https://drive.google.com/file/d/...");
      } else if (sourceType === 'youtube') {
        setPlaceholderUrl("https://www.youtube.com/watch?v=...");
      } else if (sourceType === 'dropbox') {
        setPlaceholderUrl("https://www.dropbox.com/scl/fi/...");
      } else {
        setPlaceholderUrl("https://domain.com/file.pdf (e.g., pdf, jpg, mp4)");
      }
      const typeName = sourceType.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      toast.success(`Input mode activated for ${typeName}`, { duration: 1500 });
    }, []);

  const handleReturnToSelect = useCallback(() => {
      setIngestionMode('select');
      setUrl("");
      // 💡 CLEAR PLACEHOLDER on return to select mode
      setPlaceholderUrl(""); 
      setLoadedContent(null);
      setError("");
      setIsLoading(false);
      toast.info("Source selection reset", { icon: "🔄", duration: 1500 });
    }, []);


  const handleLoadContent = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      toast.error("Please enter a valid URL", { icon: "⚠️", duration: 3000 });
      return;
    }

    setIsLoading(true);
    setError("");

    const loadingToast = toast.loading("Loading content...", { duration: 2000 });

    try {
      const detectedType = detectContentType(url);

      if (detectedType === "invalid-url" || detectedType === "unknown") {
        setError("Invalid or unsupported content URL. Please check the link or select a supported source.");
        toast.error("Invalid or unsupported content URL", { id: loadingToast, icon: "❌", duration: 4000 });
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

      // Success toast (will be replaced by component toast after delay)
      toast.success(`Content loaded successfully!`, { id: loadingToast, icon: "🔗", duration: 3000 });
    } catch {
      setError("Failed to load content. Please try again.");
      toast.error("Failed to load content", { id: loadingToast, icon: "💥", duration: 4000 });
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


  // Main Component Return
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Repository
          </h1>
          <p className="text-gray-600">
            Select a source below to ingest and process external content with real-time progress tracking.
          </p>
        </div>

        {/* Conditional Rendering: Selection vs. Input/Ingestion */}
        
        {ingestionMode === 'select' ? (
          <InitialSelectionScreen onSelect={handleSelectSource} />
        ) : (
          <div className="space-y-6">
            {/* URL Input Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label
                    htmlFor="url-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Content URL
                    {/* Back Button */}
                    <button 
                      onClick={handleReturnToSelect}
                      className="ml-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-full"
                    >
                      &larr; Change Source
                    </button>
                  </label>

<input
  id="url-input"
  type="url"
  value={url}
  onChange={(e) => {
    setUrl(e.target.value);
  }}
  // 💡 MODIFIED ATTRIBUTE: Use placeholderUrl, or a generic fallback if empty
  placeholder={placeholderUrl || "Paste the URL for your content here..."} 
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

            {/* Content Preview Section */}
            <div className="min-h-[600px] h-[600px]">
              {loadedContent ? (
                <div className="h-full">{renderContentPreview()}</div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex items-center justify-center">
                  <div className="text-center p-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ExternalLink className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      Ready to Ingest
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Paste your content URL above and click **'Load Content'** to begin
                      the ingestion process.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}