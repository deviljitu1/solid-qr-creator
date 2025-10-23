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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QR Code Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Create beautiful QR codes instantly for any text or URL
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-border/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Enter your text or URL to generate a QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qr-input">Text or URL</Label>
                <Input
                  id="qr-input"
                  placeholder="https://example.com or any text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-size">Size: {size}px</Label>
                <Input
                  id="qr-size"
                  type="range"
                  min="128"
                  max="512"
                  step="64"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="cursor-pointer"
                />
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full"
                size="lg"
              >
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated QR code will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              {generatedValue ? (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg shadow-inner">
                    <QRCode
                      id="qr-code"
                      value={generatedValue}
                      size={Math.min(size, 256)}
                      level="H"
                      className="transition-all duration-300"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="w-32 h-32 border-2 border-dashed border-muted rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-12 h-12 opacity-30" />
                  </div>
                  <p>Enter text and click generate to create your QR code</p>
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
