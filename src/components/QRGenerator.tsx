import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";

const QRGenerator = () => {
  const [value, setValue] = useState("");
  const [size, setSize] = useState(256);
  const [generatedValue, setGeneratedValue] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(50);

  const handleGenerate = () => {
    if (!value.trim()) {
      toast.error("Please enter some text or URL");
      return;
    }
    setGeneratedValue(value);
    toast.success("QR Code generated!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target?.result as string);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const qrImg = new Image();

    // Use 8x resolution for ultra high quality output
    const highResSize = size * 8;
    canvas.width = highResSize;
    canvas.height = highResSize;

    qrImg.onload = () => {
      if (!ctx) return;
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, highResSize, highResSize);
      ctx.drawImage(qrImg, 0, 0, highResSize, highResSize);

      // If logo is present, draw it in the center
      if (logoImage) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSizeScaled = (highResSize * logoSize) / 100;
          const logoX = (highResSize - logoSizeScaled) / 2;
          const logoY = (highResSize - logoSizeScaled) / 2;
          
          // Draw white background for logo
          ctx.fillStyle = 'white';
          ctx.fillRect(logoX - 10, logoY - 10, logoSizeScaled + 20, logoSizeScaled + 20);
          
          // Draw logo
          ctx.drawImage(logoImg, logoX, logoY, logoSizeScaled, logoSizeScaled);
          
          const pngFile = canvas.toDataURL("image/png", 1.0);
          const downloadLink = document.createElement("a");
          downloadLink.download = "qrcode-with-logo.png";
          downloadLink.href = pngFile;
          downloadLink.click();
          toast.success("High quality QR Code with logo downloaded!");
        };
        logoImg.src = logoImage;
      } else {
        const pngFile = canvas.toDataURL("image/png", 1.0);
        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode-high-quality.png";
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("High quality QR Code downloaded!");
      }
    };

    qrImg.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Himanshu QR Code Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Create beautiful, professional QR codes instantly for any text or URL
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="shadow-2xl border-2 border-primary/20 backdrop-blur-sm hover:shadow-primary/10 transition-all duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Input Details</CardTitle>
              <CardDescription>Enter your text or URL to generate a QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-input" className="text-base font-semibold">Text or URL</Label>
                <Input
                  id="qr-input"
                  placeholder="https://example.com or any text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="qr-size" className="text-base font-semibold">Size: {size}px</Label>
                <Input
                  id="qr-size"
                  type="range"
                  min="128"
                  max="512"
                  step="64"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="cursor-pointer h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/50">
                <Label className="text-base font-semibold">Custom Logo (Optional)</Label>
                <div className="space-y-3">
                  {logoImage ? (
                    <div className="relative">
                      <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                        <img src={logoImage} alt="Logo preview" className="w-16 h-16 object-cover rounded-md" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Logo uploaded</p>
                          <p className="text-xs text-muted-foreground">Will appear in QR center</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLogoImage(null)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-3 space-y-2">
                        <Label htmlFor="logo-size" className="text-sm">Logo Size: {logoSize}%</Label>
                        <Input
                          id="logo-size"
                          type="range"
                          min="20"
                          max="80"
                          step="5"
                          value={logoSize}
                          onChange={(e) => setLogoSize(Number(e.target.value))}
                          className="cursor-pointer h-2"
                        />
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Upload your logo</span>
                      </div>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-2 border-accent/20 backdrop-blur-sm hover:shadow-accent/10 transition-all duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">QR Code Preview</CardTitle>
              <CardDescription>Your generated QR code will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[350px] sm:min-h-[400px]">
              {generatedValue ? (
                <div className="space-y-6 flex flex-col items-center w-full animate-scale-in">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-20 rounded-2xl"></div>
                    <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-primary/30">
                      <div className="relative">
                        <QRCode
                          id="qr-code"
                          value={generatedValue}
                          size={Math.min(size, 256)}
                          level="H"
                          className="transition-all duration-300"
                        />
                        {logoImage && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md shadow-lg">
                            <img 
                              src={logoImage} 
                              alt="Logo" 
                              className="object-cover rounded"
                              style={{ 
                                width: `${Math.min(size, 256) * logoSize / 100}px`, 
                                height: `${Math.min(size, 256) * logoSize / 100}px` 
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download {logoImage ? "QR with Logo" : "PNG"}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground animate-fade-in">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-dashed border-muted rounded-2xl flex items-center justify-center mb-6 mx-auto bg-muted/5">
                    <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 opacity-20" />
                  </div>
                  <p className="text-base sm:text-lg font-medium">Enter text and click generate to create your QR code</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
