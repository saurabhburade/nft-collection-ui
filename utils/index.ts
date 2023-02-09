export const formatEthAddress = (account: string) => {
  const address = account;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function uriToHttp(uri: string): string[] {
  const protocol = uri.split(":")[0].toLowerCase();
  switch (protocol) {
    case "https":
      return [uri];
    case "http":
      return [`https${uri.substring(4)}`, uri];
    case "ipfs":
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://dweb.link/ipfs/${hash}/`,
        `https://gateway.pinata.cloud/ipfs/${hash}/`,
      ];
    case "ipns":
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://dweb.link/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
}
