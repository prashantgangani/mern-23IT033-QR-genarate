
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateQRCode, shareQRCodeViaEmail } from '@/services/qrcode';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCode } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const urlSchema = z.object({
  title: z.string().optional(),
  content: z.string().url('Please enter a valid URL'),
});

const textSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Please enter some text'),
});

type UrlFormValues = z.infer<typeof urlSchema>;
type TextFormValues = z.infer<typeof textSchema>;

const GenerateQR = () => {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [generatedQR, setGeneratedQR] = useState<QRCode | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const { toast } = useToast();

  const urlForm = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const textForm = useForm<TextFormValues>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const handleGenerateQR = async (values: UrlFormValues | TextFormValues) => {
    try {
      const response = await generateQRCode(values.content, activeTab, values.title);
      setGeneratedQR(response);
      
      // Generate QR code image using the qrcode library from CDN (in a real app you'd use the qrcode npm package)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(values.content)}`;
      setQrCodeImage(qrCodeUrl);
      
      toast({
        title: 'QR Code Generated',
        description: 'Your QR code has been successfully generated.',
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate QR code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = `qrcode-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'QR Code Downloaded',
        description: 'Your QR code has been downloaded as an image.',
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedQR) {
      navigator.clipboard.writeText(generatedQR.content);
      toast({
        title: 'Copied to Clipboard',
        description: 'The QR code content has been copied to your clipboard.',
      });
    }
  };

  const handleShareViaEmail = async () => {
    if (generatedQR && shareEmail) {
      try {
        await shareQRCodeViaEmail(generatedQR._id, shareEmail);
        setShareEmail('');
        toast({
          title: 'QR Code Shared',
          description: `Your QR code has been shared to ${shareEmail}.`,
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        toast({
          title: 'Sharing Failed',
          description: 'Failed to share QR code via email. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Generate QR Code</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New QR Code</CardTitle>
            <CardDescription>Select the type of QR code you want to generate</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" onValueChange={(value) => setActiveTab(value as 'url' | 'text')}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <Form {...urlForm}>
                  <form onSubmit={urlForm.handleSubmit(handleGenerateQR)} className="space-y-4">
                    <FormField
                      control={urlForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="My Website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={urlForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Generate QR Code
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="text">
                <Form {...textForm}>
                  <form onSubmit={textForm.handleSubmit(handleGenerateQR)} className="space-y-4">
                    <FormField
                      control={textForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="My Text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={textForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your text here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Generate QR Code
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {qrCodeImage && (
          <Card>
            <CardHeader>
              <CardTitle>Your QR Code</CardTitle>
              <CardDescription>
                {generatedQR?.title || 'QR Code'} - Created on {new Date(generatedQR?.createdAt || '').toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-white rounded-lg">
                <img src={qrCodeImage} alt="QR Code" className="w-48 h-48" />
              </div>
              
              <div className="w-full space-y-4">
                <div className="flex flex-col gap-2">
                  <Button onClick={handleDownload}>Download QR Code</Button>
                  <Button variant="outline" onClick={handleCopyToClipboard}>Copy Content to Clipboard</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Share via Email</h3>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="recipient@example.com"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                    <Button onClick={handleShareViaEmail}>Share</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GenerateQR;
