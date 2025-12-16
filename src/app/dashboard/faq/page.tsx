
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FaqPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about integrating your messaging channels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I get a WhatsApp API Key?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>To connect your WhatsApp account, you need a WhatsApp Business API key. You can obtain one by following these steps:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Go to the <Link href="https://developers.facebook.com/apps/" target="_blank" className="text-primary underline">Meta for Developers</Link> portal and log in with your Facebook account.</li>
                    <li>Click on "My Apps" and then "Create App".</li>
                    <li>Select "Business" as the app type and click "Next".</li>
                    <li>Provide an app name (e.g., "ConnectVerse Integration") and your contact email.</li>
                    <li>From the "Add Products to Your App" screen, select "WhatsApp" by clicking "Set Up".</li>
                    <li>Follow the on-screen instructions to link your WhatsApp Business Account.</li>
                    <li>Once set up, you will find your temporary Access Token and a Phone Number ID in the WhatsApp API dashboard. Use this token as your API key in ConnectVerse.</li>
                  </ol>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank">Read Full WhatsApp API Documentation</Link>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I get a Messenger API Key?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>To integrate Facebook Messenger, you'll need to create a Facebook App and get a Page Access Token. Please note this integration is for Facebook Pages, not personal accounts.</p>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>Go to <Link href="https://developers.facebook.com/apps/" target="_blank" className="text-primary underline">Meta for Developers</Link> and create a new app.</li>
                        <li>From the app dashboard, add the "Messenger" product.</li>
                        <li>In the Messenger settings, link your app to your Facebook Page.</li>
                        <li>Under the "Access Tokens" section, generate a new token for your page. This token is your API key.</li>
                        <li>Ensure your app has the `pages_messaging` and `pages_show_list` permissions.</li>
                    </ol>
                     <Button asChild variant="link" className="p-0 h-auto">
                        <Link href="https://developers.facebook.com/docs/messenger-platform/getting-started" target="_blank">Read Full Messenger API Documentation</Link>
                    </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I get an Instagram API Key?</AccordionTrigger>
              <AccordionContent>
                 <div className="space-y-4 text-sm text-muted-foreground">
                    <p>Instagram integration uses the same Meta for Developers platform as Messenger.</p>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>You'll need an Instagram Business account that is connected to a Facebook Page.</li>
                        <li>In your Facebook App settings on the <Link href="https://developers.facebook.com/apps/" target="_blank" className="text-primary underline">Meta for Developers</Link> portal, add the "Instagram Basic Display" product.</li>
                        <li>Set up the product and generate a Page Access Token for the linked Facebook Page. This token will grant permissions for Instagram messaging.</li>
                        <li>Your app will need the `instagram_basic` and `instagram_manage_messages` permissions.</li>
                    </ol>
                    <Button asChild variant="link" className="p-0 h-auto">
                        <Link href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started" target="_blank">Read Full Instagram API Documentation</Link>
                    </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I get a TikTok API Key?</AccordionTrigger>
              <AccordionContent>
                 <div className="space-y-4 text-sm text-muted-foreground">
                    <p>To integrate TikTok, you need to apply for access to the TikTok for Business Developer API.</p>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>Visit the <Link href="https://developers.tiktok.com/" target="_blank" className="text-primary underline">TikTok for Business Developer Portal</Link>.</li>
                        <li>Create a developer account and register a new application.</li>
                        <li>Once your application is approved, you will get access to your App ID and App Secret.</li>
                        <li>Use these credentials to authenticate and generate an access token, which will serve as your API Key for sending and receiving messages.</li>
                    </ol>
                    <Button asChild variant="link" className="p-0 h-auto">
                        <Link href="https://developers.tiktok.com/doc/overview" target="_blank">Read Full TikTok API Documentation</Link>
                    </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
