import type { Channel } from "@/lib/data";

const iconUrls: Record<Channel, string> = {
  whatsapp: "https://img.icons8.com/?size=100&id=99g_nik1bya1&format=png&color=000000",
  messenger: "https://img.icons8.com/?size=100&id=8LtsGRrFVKGe&format=png&color=000000",
  instagram: "https://img.icons8.com/?size=100&id=5eT5OnLluNOx&format=png&color=000000",
  tiktok: "https://img.icons8.com/?size=100&id=SpIfxZbiwM1P&format=png&color=000000",
};

export const ChannelIcon = ({ channel, ...props }: { channel: Channel } & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const url = iconUrls[channel];
  if (!url) return null;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={`${channel} icon`} {...props} />;
};
