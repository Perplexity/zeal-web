type ProxyType = 'HTTP(S)' | 'SOCKS4' | 'SOCKS5';
type Proxy = {
  type: ProxyType;
  ip: string;
  port: number;
  username?: string;
  password?: string;
};
export default Proxy;