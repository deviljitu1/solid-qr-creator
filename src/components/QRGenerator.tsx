import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

const QRGenerator = () => {
  const [value, setValue] = useState("");
  const [size, setSize] = useState(256);
  const [generatedValue, setGeneratedValue] = useState("");

  const handleGenerate = () => {
    if (!value.trim()) {
      toast.error("Please enter some text or URL");
      return;
    }
    setGeneratedValue(value);
    toast.success("QR Code generated!");
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
                      <QRCode
                        id="qr-code"
                        value={generatedValue}
                        size={Math.min(size, 256)}
                        level="H"
                        className="transition-all duration-300"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PNG
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
