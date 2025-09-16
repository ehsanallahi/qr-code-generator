"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { toPng, toSvg } from 'html-to-image';
import { cn } from '@/lib/utils';
import { motion } from "motion/react";
// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react'; // NEW: Import a trash icon for the delete button
import FooterSection from '@/components/footer';
import { Cover } from '@/components/ui/cover';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';


// Custom Hook for debouncing input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("text");
  const [text, setText] = useState("https://www.linkedin.com/in/ehsanallahi");
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" });
  const [qrValue, setQrValue] = useState(text);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoImage, setLogoImage] = useState(null);
  const debouncedQrValue = useDebounce(qrValue, 500);
  const [isDownloading, setIsDownloading] = useState(false);
  const [history, setHistory] = useState([]);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('qrHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'text') {
      setQrValue(text);
    } else if (activeTab === 'wifi') {
      const { ssid, password, encryption } = wifi;
      setQrValue(`WIFI:S:${ssid};T:${encryption};P:${password};;`);
    }
  }, [text, wifi, activeTab]);

  const handleDownload = useCallback((format) => {
    if (qrCodeRef.current === null) return;
    
    setIsDownloading(true);
    const options = { cacheBust: true, pixelRatio: 3 };
    let promise = format === 'png' ? toPng(qrCodeRef.current, options) : toSvg(qrCodeRef.current, options);

    promise.then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qrcode.${format}`;
        link.click();
      })
      .catch((err) => console.error('Download failed:', err))
      .finally(() => setIsDownloading(false));
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addToHistory = () => {
    const newEntry = {
      value: qrValue,
      fgColor,
      bgColor,
      logoImage,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
  };

  const loadFromHistory = (entry) => {
      setQrValue(entry.value);
      setText(entry.value);
      setFgColor(entry.fgColor);
      setBgColor(entry.bgColor);
      setLogoImage(entry.logoImage);
      setActiveTab("text");
  };
  
  // NEW: Function to delete a specific item from history
  const deleteFromHistory = (timestamp) => {
    const updatedHistory = history.filter(item => item.timestamp !== timestamp);
    setHistory(updatedHistory);
    localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
  };

  const isQrValueEmpty = !debouncedQrValue.trim() || (activeTab === 'wifi' && !wifi.ssid.trim());
 const words = ["better", "modern", "beautiful", "awesome"];
 
  return (
    
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900  ">
      <h1 className="text-4xl md:text-4xl dark bg-gray-900 lg:text-6xl font-bold max-w-7xl mx-auto  text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800  dark:via-white dark:to-white">
        Design powerful QR codes <br /> at <Cover>   warp speed</Cover>
      </h1>
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4 gap-8">
        
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Advanced QR Code Generator</CardTitle>
            <CardDescription>Create functional and stylish QR codes.</CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text / URL</TabsTrigger>
                <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
                <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg h-[320px] mb-6">
                    {isQrValueEmpty ? (
                        <p className="text-muted-foreground text-center">Your QR code will appear here</p>
                    ) : (
                        <div ref={qrCodeRef} style={{ background: bgColor, padding: '16px', borderRadius: '8px' }}>
                            <QRCode
                                value={debouncedQrValue}
                                size={256}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={"H"}
                                includeMargin={false}
                                imageSettings={logoImage ? { src: logoImage, height: 50, width: 50, excavate: true } : undefined}
                            />
                        </div>
                    )}
                </div>

                <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="text">Your Text or URL</Label>
                        <Input id="text" placeholder="e.g., https://google.com" value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                </TabsContent>

                <TabsContent value="wifi" className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ssid">Network Name (SSID)</Label>
                        <Input id="ssid" placeholder="My Home Wi-Fi" value={wifi.ssid} onChange={(e) => setWifi({...wifi, ssid: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="********" value={wifi.password} onChange={(e) => setWifi({...wifi, password: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="encryption">Encryption</Label>
                        <Select value={wifi.encryption} onValueChange={(value) => setWifi({...wifi, encryption: value})}>
                            <SelectTrigger id="encryption"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                                <SelectItem value="WEP">WEP</SelectItem>
                                <SelectItem value="nopass">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Styling Options</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fgColor">Foreground</Label>
                                    <Input id="fgColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-1 h-10 cursor-pointer" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bgColor">Background</Label>
                                    <Input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10 cursor-pointer" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo Image</Label>
                                <Input id="logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} className="file:text-primary file:font-semibold" />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button onClick={addToHistory} variant="outline" className="w-full" disabled={isQrValueEmpty}>Save to History</Button>
              <div className="grid grid-cols-2 gap-4 w-full">
                  <Button onClick={() => handleDownload('png')} disabled={isDownloading || isQrValueEmpty}>
                    {isDownloading ? '...' : 'Download PNG'}
                  </Button>
                  <Button onClick={() => handleDownload('svg')} disabled={isDownloading || isQrValueEmpty}>
                    {isDownloading ? '...' : 'Download SVG'}
                  </Button>
              </div>
            </CardFooter>
          </Tabs>
        </Card>
        
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">View History</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generation History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                    {history.length > 0 ? history.map((item) => ( // MODIFIED: No longer need index
                        <div key={item.timestamp} className="flex items-center justify-between p-2 border rounded-md gap-4"> {/* MODIFIED: Key is now the unique timestamp */}
                           <div className="bg-white p-1 rounded-md">
                                <QRCode value={item.value} size={48} level="Q" fgColor={item.fgColor} bgColor={item.bgColor} />
                           </div>
                           <p className="truncate text-sm flex-grow">{item.value}</p>
                           <div className="flex items-center gap-2"> {/* NEW: Wrapper for buttons */}
                               <Button size="sm" onClick={() => loadFromHistory(item)}>Load</Button>
                               <Button size="sm" variant="destructive" onClick={() => deleteFromHistory(item.timestamp)}> {/* NEW: Delete button */}
                                   <Trash2 className="h-4 w-4" />
                               </Button>
                           </div>
                        </div>
                    )) : <p className="text-muted-foreground text-center">No history yet.</p>}
                </div>
            </DialogContent>
        </Dialog>
         
      <div className="dark bg-gray-900 p-10 rounded-lg">

  <motion.h1
    initial={{
      opacity: 0,
    }}
    whileInView={{
      opacity: 1,
    }}
    className={cn(
      "relative mb-6 max-w-6xl text-center text-4xl leading-normal font-bold tracking-tight text-zinc-100 md:text-7xl",
    )}
    layout
  >
    <div className="inline-block">
      Want your websites look 10x <ContainerTextFlip words={words} />
      {/* <Blips /> */} Contact Now! 👇
    </div>
  </motion.h1>
  
</div>
      </main>
     
      <FooterSection />
    </div>
  );
}