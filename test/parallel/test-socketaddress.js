'use strict';

const common = require('../common');
const {
  ok,
  strictEqual,
  throws,
} = require('assert');
const {
  SocketAddress,
} = require('net');
const {
  MessageChannel,
} = require('worker_threads');

{
  const sa = new SocketAddress();
  strictEqual(sa.address, '127.0.0.1');
  strictEqual(sa.port, 0);
  strictEqual(sa.family, 'ipv4');
  strictEqual(sa.flowlabel, 0);

  const mc = new MessageChannel();
  mc.port1.onmessage = common.mustCall(({ data }) => {
    ok(SocketAddress.isSocketAddress(data));

    strictEqual(data.address, '127.0.0.1');
    strictEqual(data.port, 0);
    strictEqual(data.family, 'ipv4');
    strictEqual(data.flowlabel, 0);

    mc.port1.close();
  });
  mc.port2.postMessage(sa);
}

{
  const sa = new SocketAddress({});
  strictEqual(sa.address, '127.0.0.1');
  strictEqual(sa.port, 0);
  strictEqual(sa.family, 'ipv4');
  strictEqual(sa.flowlabel, 0);
}

{
  const sa = new SocketAddress({
    address: '123.123.123.123',
  });
  strictEqual(sa.address, '123.123.123.123');
  strictEqual(sa.port, 0);
  strictEqual(sa.family, 'ipv4');
  strictEqual(sa.flowlabel, 0);
}

{
  const sa = new SocketAddress({
    address: '123.123.123.123',
    port: 80
  });
  strictEqual(sa.address, '123.123.123.123');
  strictEqual(sa.port, 80);
  strictEqual(sa.family, 'ipv4');
  strictEqual(sa.flowlabel, 0);
}

{
  const sa = new SocketAddress({
    family: 'ipv6'
  });
  strictEqual(sa.address, '::');
  strictEqual(sa.port, 0);
  strictEqual(sa.family, 'ipv6');
  strictEqual(sa.flowlabel, 0);
}

{
  const sa = new SocketAddress({
    family: 'ipv6',
    flowlabel: 1,
  });
  strictEqual(sa.address, '::');
  strictEqual(sa.port, 0);
  strictEqual(sa.family, 'ipv6');
  strictEqual(sa.flowlabel, 1);
}

[1, false, 'hello'].forEach((i) => {
  throws(() => new SocketAddress(i), {
    code: 'ERR_INVALID_ARG_TYPE'
  });
});

[1, false, {}, [], 'test'].forEach((family) => {
  throws(() => new SocketAddress({ family }), {
    code: 'ERR_INVALID_ARG_VALUE'
  });
});

[1, false, {}, []].forEach((address) => {
  throws(() => new SocketAddress({ address }), {
    code: 'ERR_INVALID_ARG_TYPE'
  });
});

[-1, false, {}, []].forEach((port) => {
  throws(() => new SocketAddress({ port }), {
    code: 'ERR_SOCKET_BAD_PORT'
  });
});

throws(() => new SocketAddress({ flowlabel: -1 }), {
  code: 'ERR_OUT_OF_RANGE'
});
