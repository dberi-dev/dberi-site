import React from 'react';

const css = `
  *,*::before,*::after{box-sizing:border-box}
  :root{
    --bg:#0a0a0b;
    --bg-2:#141416;
    --ink:#ffffff;
    --ink-2:#e8e8ea;
    --muted:rgba(255,255,255,.55);
    --faint:rgba(255,255,255,.35);
    --line:rgba(255,255,255,.08);
    --line-2:rgba(255,255,255,.08);
    --indigo:#5b5bd6;
    --ok:#22c55e;
  }
  html,body{margin:0;padding:0;background:var(--bg);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  a{color:inherit;text-decoration:none}

  body::before{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(60% 50% at 80% 0%, rgba(255,255,255,.04), transparent 60%),
      radial-gradient(50% 40% at 10% 100%, rgba(255,255,255,.025), transparent 60%);
  }

  header{
    position:fixed;top:0;left:0;right:0;z-index:50;
    display:flex;align-items:center;justify-content:space-between;
    padding:18px 40px;
    background:rgba(10,10,11,.72);
    backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    border-bottom:1px solid rgba(255,255,255,.06);
  }
  .wm{font-weight:600;font-size:17px;letter-spacing:-0.025em;display:flex;align-items:center;gap:9px;color:var(--ink)}
  .wm .glyph{
    width:22px;height:22px;border-radius:6px;background:#ffffff;color:#0a0a0b;
    display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:-0.04em;
  }
  nav.actions{display:flex;align-items:center;gap:6px}
  nav.midnav{display:flex;gap:28px;font-size:14px;color:var(--ink-2)}
  nav.midnav a{color:var(--muted);transition:color .15s}
  nav.midnav a:hover{color:var(--ink)}

  .btn{
    display:inline-flex;align-items:center;gap:8px;
    height:38px;padding:0 18px;border-radius:999px;
    font-size:13.5px;font-weight:500;letter-spacing:-0.005em;
    transition:transform .15s ease, background .15s ease, color .15s ease, box-shadow .15s ease;
    white-space:nowrap;cursor:pointer;border:0;font-family:inherit;
  }
  .btn-ghost{color:var(--ink-2);background:transparent}
  .btn-ghost:hover{background:rgba(255,255,255,.06)}
  .btn-primary{color:#0a0a0b;background:#ffffff;box-shadow:0 1px 0 rgba(0,0,0,.06) inset, 0 6px 18px rgba(255,255,255,.10)}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(0,0,0,.06) inset, 0 10px 26px rgba(255,255,255,.18)}
  .btn .arrow{transition:transform .18s ease}
  .btn:hover .arrow{transform:translate(2px,-2px)}

  main{position:relative;z-index:10}
  .hero{
    min-height:100vh;
    display:grid;grid-template-columns:1fr 1.05fr;gap:48px;align-items:center;
    max-width:1280px;margin:0 auto;
    padding:140px 40px 80px;
    position:relative;
  }

  .kicker{
    display:inline-flex;align-items:center;gap:8px;
    font-size:12px;letter-spacing:-0.005em;color:var(--muted);
    padding:5px 10px 5px 8px;border-radius:999px;
    background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
    margin-bottom:24px;
  }
  .kicker .dot{width:6px;height:6px;border-radius:50%;background:var(--ok);display:inline-block;box-shadow:0 0 0 3px rgba(34,197,94,.18)}

  h1{
    font-weight:700;
    font-size:clamp(40px,5.4vw,68px);line-height:1.02;letter-spacing:-0.04em;
    margin:0 0 22px;text-wrap:balance;color:var(--ink);
  }

  p.sub{
    margin:0 0 36px;max-width:480px;
    color:var(--muted);font-size:17px;line-height:1.55;letter-spacing:-0.005em;
    text-wrap:pretty;
  }

  .cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;align-items:center}
  .cta-row .btn{height:46px;padding:0 22px;font-size:14.5px}
  .cta-row .meta{font-size:12.5px;color:var(--faint);margin-left:4px}

  .stage{position:relative;height:620px}
  .dash-wrap{
    position:absolute;top:50%;left:0;transform:translateY(-50%);
    width:1040px;height:600px;
    border-radius:14px;overflow:hidden;
    background:#ffffff;color:#111;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.08),
      0 50px 110px rgba(0,0,0,.6),
      0 24px 50px rgba(0,0,0,.35);
    font-size:13px;
  }
  .chrome{
    height:34px;background:#f4f1ec;display:flex;align-items:center;padding:0 14px;gap:8px;
    border-bottom:1px solid #e9e5dd;
  }
  .chrome .tl{display:flex;gap:6px}
  .chrome .tl i{width:11px;height:11px;border-radius:50%;display:inline-block}
  .chrome .tl i.r{background:#ed6a5e}
  .chrome .tl i.y{background:#f4be4f}
  .chrome .tl i.g{background:#62c554}
  .chrome .url{margin-left:auto;margin-right:auto;background:#fff;border:1px solid #e1ddd3;border-radius:6px;height:20px;line-height:20px;padding:0 12px;font-size:11px;color:#666}
  .chrome .url::before{content:"🔒  ";font-size:9px;opacity:.6}

  .dash{display:grid;grid-template-columns:218px 1fr;height:calc(100% - 34px);background:#fff}

  .side{padding:18px 14px;display:flex;flex-direction:column;gap:14px;border-right:1px solid #ececec;background:#fff}
  .side .brand{display:flex;align-items:center;gap:10px;padding:4px 6px 10px}
  .side .brand .icn{width:32px;height:32px;border-radius:9px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center}
  .side .brand .icn svg{width:16px;height:16px}
  .side .brand b{font-weight:600;font-size:13.5px;letter-spacing:-0.02em;color:#111}

  .navgrp{display:flex;flex-direction:column;gap:2px}
  .navgrp .lbl{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;padding:8px 8px 4px;font-weight:500}
  .nv{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:8px;font-size:12.5px;color:#3a3a3a;cursor:pointer;letter-spacing:-0.01em}
  .nv:hover{background:#f6f6f7}
  .nv.act{background:#eeefff;color:var(--indigo);font-weight:500}
  .nv svg{width:14px;height:14px;flex:0 0 auto;opacity:.9}

  .side .foot{margin-top:auto;display:flex;flex-direction:column;gap:2px}
  .side .me{display:flex;align-items:center;gap:9px;padding-top:14px;border-top:1px solid #f0f0f0;margin-top:8px}
  .side .me .av{width:24px;height:24px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600}
  .side .me span{font-size:12.5px;font-weight:500;color:#222}

  .panel{padding:22px 28px;overflow:hidden;position:relative}
  .topbar{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px}
  .crumb{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:500;margin-bottom:6px}
  .grosswrap{display:flex;align-items:center;gap:10px;margin-bottom:2px}
  .grosslbl{font-size:13px;color:#888;display:flex;align-items:center;gap:6px}
  .grosslbl .info{width:13px;height:13px;border-radius:50%;border:1px solid #bbb;display:inline-flex;align-items:center;justify-content:center;font-size:9px;color:#888}
  .tabs{display:flex;gap:6px;align-items:center}
  .tabs span{font-size:11px;letter-spacing:.06em;color:#9a9a9a;padding:4px 10px;border-radius:999px;cursor:pointer;text-transform:uppercase;font-weight:500}
  .tabs span.act{background:#111;color:#fff}

  .gross{display:flex;align-items:baseline;gap:8px;margin:6px 0 4px}
  .gross .cur{font-size:14px;color:#555}
  .gross .n{font-size:46px;font-weight:700;letter-spacing:-0.04em;line-height:1;color:#111}
  .txns{font-size:12px;color:#888;margin-bottom:18px}

  .topright{display:flex;align-items:center;gap:10px}
  .newsale{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;background:#fff;border:1px solid #e1ddd3;font-size:12px;color:#222;font-weight:500;cursor:pointer}
  .newsale svg{width:12px;height:12px}
  .acct{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:999px;background:#f6f6f7;font-size:12px;color:#222;font-weight:500}
  .acct .av{width:18px;height:18px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600}

  .rev{border:1px solid #ececec;border-radius:14px;padding:18px 20px 8px;background:#fff;margin-bottom:24px}
  .rev .row1{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
  .rev .lbl{font-size:12px;color:#888;margin-bottom:6px}
  .rev .val{display:flex;align-items:baseline;gap:8px}
  .rev .val b{font-size:22px;font-weight:700;letter-spacing:-0.02em}
  .rev .val .up{font-size:12px;color:#16a34a;font-weight:500}
  .rev .range{font-size:11px;color:#666;border:1px solid #e1ddd3;border-radius:8px;padding:4px 10px;display:inline-flex;align-items:center;gap:6px}
  .chart{height:88px;position:relative;margin-top:8px}
  .chart svg{width:100%;height:100%;display:block}
  .xax{display:flex;justify-content:space-between;font-size:10.5px;color:#a3a3a3;margin-top:4px}

  .sales-h{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px}
  .sales-h h4{margin:0;font-size:24px;font-weight:700;letter-spacing:-0.02em;color:#111}
  .sales-h .desc{font-size:12px;color:#888;margin-top:2px}
  .sales-h .va{font-size:12px;color:#222;display:inline-flex;align-items:center;gap:4px}

  table.sales{width:100%;border-collapse:collapse;font-size:12.5px}
  table.sales thead th{font-size:11px;color:#888;font-weight:500;padding:8px 0;text-align:left;border-bottom:1px solid #ececec}
  table.sales thead th.r{text-align:right}
  table.sales td{padding:11px 0;border-bottom:1px solid #f3f3f3;color:#222}
  table.sales td.r{text-align:right}
  table.sales td.muted{color:#aaa}
  .cust{display:flex;align-items:center;gap:9px}
  .cust .cav{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:600;color:#fff;flex:0 0 auto;background:#111}
  .cust .cav.a{background:#0a0a0a}
  .cust .cav.b{background:#3a3a3a}
  .cust .cav.c{background:#5a5a5a}
  .cust .cav.d{background:#2a2a2a}
  .cust .cnm{font-size:12.5px;color:#222;font-weight:500;letter-spacing:-0.01em}
  .cust .cid{font-size:10.5px;color:#aaa;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;margin-top:1px}
  .status{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#666;font-weight:500}
  .status.ok{color:#16a34a}

  .dash-wrap::after{
    content:"";position:absolute;top:34px;right:0;bottom:0;width:140px;pointer-events:none;
    background:linear-gradient(90deg, rgba(10,10,11,0), rgba(10,10,11,.95));
  }

  .section{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:96px 40px}
  .sec-h{margin-bottom:56px;max-width:680px}
  .sec-h .eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:14px;display:block}
  .sec-h h2{font-size:clamp(30px,3.4vw,46px);font-weight:700;letter-spacing:-0.035em;line-height:1.05;margin:0 0 14px;text-wrap:balance;color:var(--ink)}
  .sec-h p{margin:0;color:var(--muted);font-size:16.5px;line-height:1.55;max-width:560px;text-wrap:pretty}

  .merch{display:grid;grid-template-columns:1.1fr 1fr;gap:14px}
  .mbig{
    background:linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01));
    border:1px solid var(--line);border-radius:18px;padding:32px;
    display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:380px;
  }
  .mbig h3{font-size:24px;font-weight:600;letter-spacing:-0.025em;margin:0 0 10px;color:var(--ink)}
  .mbig p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.55;max-width:380px}
  .mbig{position:relative;overflow:hidden;min-height:540px}
  .mbig .copy{max-width:380px;position:relative;z-index:2}
  .scene{
    position:relative;flex:1;min-height:340px;
    display:flex;align-items:flex-end;justify-content:center;
    margin:24px -16px -32px;
  }
  .scene::before{
    content:"";position:absolute;inset:auto -40px -20% 50%;
    width:520px;height:520px;transform:translateX(-50%);
    background:radial-gradient(closest-side, rgba(255,255,255,.08), transparent 70%);
    pointer-events:none;
  }

  .phone{
    position:relative;z-index:2;
    width:240px;height:440px;border-radius:36px;
    background:linear-gradient(180deg,#1a1a1d,#0e0e10);
    padding:7px;
    box-shadow:
      inset 0 0 0 1px rgba(255,255,255,.08),
      0 40px 70px rgba(0,0,0,.55),
      0 18px 30px rgba(0,0,0,.35);
  }
  .phone .scr{
    position:relative;width:100%;height:100%;border-radius:30px;overflow:hidden;
    background:linear-gradient(180deg,#fafafa 0%,#f5f5f5 100%);
    color:#0a0a0b;display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:40px 24px 24px;
  }
  .ph-stack{display:flex;flex-direction:column;align-items:center;gap:24px;width:100%}
  .phone .notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:74px;height:18px;border-radius:10px;background:#000;z-index:3}
  .phone .stat{position:absolute;top:14px;left:18px;right:18px;display:flex;justify-content:space-between;font-size:10.5px;color:rgba(10,10,11,.65);font-weight:600;letter-spacing:-0.01em;z-index:2}

  .ph-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  .ph-hdr .l{font-size:11px;color:rgba(10,10,11,.5);letter-spacing:.1em;text-transform:uppercase;font-weight:600}
  .ph-hdr .bell{width:22px;height:22px;border-radius:50%;background:rgba(10,10,11,.05);display:flex;align-items:center;justify-content:center;color:rgba(10,10,11,.6)}

  .ph-check{
    width:85px;height:85px;border-radius:50%;background:#16a34a;color:#fff;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 0 14px rgba(22,163,74,.12);
    position:relative;
  }
  .ph-check svg{
    width:34px;height:34px;
  }
  .ph-amt{text-align:center;font-size:48px;font-weight:700;letter-spacing:-0.04em;color:#0a0a0b;line-height:1}
  .ph-amt .cur{font-size:16px;color:#9ca3af;font-weight:500;margin-right:2px;vertical-align:10px}
  .ph-sub{text-align:center;font-size:14px;color:#16a34a;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-top:4px}

  .ph-cust{
    margin:16px 4px 12px;padding:10px 12px;border-radius:12px;
    background:rgba(10,10,11,.04);
    display:flex;align-items:center;gap:10px;
  }
  .ph-cust .av{width:28px;height:28px;border-radius:50%;background:#0a0a0b;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:600;flex:0 0 auto}
  .ph-cust .nm{font-size:12.5px;font-weight:600;letter-spacing:-0.01em}
  .ph-cust .ha{font-size:10.5px;color:rgba(10,10,11,.5);margin-top:1px}
  .ph-cust .ch{margin-left:auto;font-size:10px;background:rgba(10,10,11,.07);color:rgba(10,10,11,.65);padding:2px 7px;border-radius:999px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}

  .ph-items{padding:0 6px;display:flex;flex-direction:column;gap:6px;font-size:11.5px;color:rgba(10,10,11,.7)}
  .ph-items .li{display:flex;justify-content:space-between;white-space:nowrap;gap:8px}
  .ph-items .li b{color:#0a0a0b;font-weight:500}
  .ph-items .ttl{display:flex;justify-content:space-between;border-top:1px dashed rgba(10,10,11,.18);padding-top:7px;margin-top:3px;font-weight:600;color:#0a0a0b}

  .ph-actions{margin-top:auto;display:flex;gap:6px;padding-top:14px}
  .ph-actions .pb{flex:1;height:32px;border-radius:999px;background:#0a0a0b;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;letter-spacing:-0.01em}
  .ph-actions .pb.sec{background:rgba(10,10,11,.06);color:#0a0a0b}

  .chip-f{
    position:absolute;z-index:3;
    display:flex;align-items:center;gap:8px;
    background:rgba(20,20,24,.88);color:#fff;
    padding:8px 12px 8px 9px;border-radius:999px;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.1), 0 14px 30px rgba(0,0,0,.4);
    backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    font-size:11.5px;font-weight:500;letter-spacing:-0.01em;white-space:nowrap;
    animation:bob 5s ease-in-out infinite;
  }
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .chip-f .ic{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:#fff}
  .chip-f .ic svg{width:13px;height:13px}

  .chip-f.c1{top:24px;left:0;animation-delay:0s}
  .chip-f.c2{top:140px;right:-8px;animation-delay:-1.6s}
  .chip-f.c3{bottom:60px;left:6px;animation-delay:-3.2s}

  .conn{position:absolute;inset:0;z-index:1;pointer-events:none}
  .conn svg{width:100%;height:100%;display:block}

  .mcol{display:flex;flex-direction:column;gap:14px}
  .msm{
    background:linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01));
    border:1px solid var(--line);border-radius:18px;padding:24px;
    flex:1;display:flex;flex-direction:column;
  }
  .msm .ic{width:36px;height:36px;border-radius:10px;background:#ffffff;color:#0a0a0b;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
  .msm .ic svg{width:18px;height:18px}
  .msm h4{margin:0 0 6px;font-size:17px;font-weight:600;letter-spacing:-0.02em;color:var(--ink)}
  .msm p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.55}

  .dev-split{display:grid;grid-template-columns:1fr 1.15fr;gap:48px;align-items:center}
  .dev-copy .eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:14px;display:block}
  .dev-copy h2{font-size:clamp(30px,3.4vw,46px);font-weight:700;letter-spacing:-0.035em;line-height:1.05;margin:0 0 16px;color:var(--ink);text-wrap:balance}
  .dev-copy > p{margin:0 0 24px;color:var(--muted);font-size:16.5px;line-height:1.55;max-width:480px}
  .devlist{list-style:none;padding:0;margin:0 0 28px;display:flex;flex-direction:column;gap:10px}
  .devlist li{display:flex;align-items:center;gap:11px;color:var(--ink-2);font-size:14.5px}
  .devlist svg{flex:0 0 auto;color:#ffffff}

  .code-card{
    background:#0e0e10;border:1px solid var(--line);border-radius:14px;overflow:hidden;
    box-shadow:0 30px 60px rgba(0,0,0,.4);
    font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:1.7;
  }
  .code-head{display:flex;align-items:center;gap:14px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.02)}
  .code-dots{display:flex;gap:5px}
  .code-dots i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.18);display:inline-block}
  .code-file{font-size:12px;color:rgba(255,255,255,.55);font-family:'Inter',sans-serif;letter-spacing:-0.01em}
  .code-copy{margin-left:auto;font-size:11px;color:rgba(255,255,255,.4);font-family:'Inter',sans-serif;cursor:pointer;padding:3px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.08)}
  .code-copy:hover{color:#fff;background:rgba(255,255,255,.05)}
  .code-body{margin:0;padding:22px 22px 24px;color:rgba(255,255,255,.7);white-space:pre;overflow-x:auto}
  .code-body .kw{color:#c792ea;font-weight:500}
  .code-body .fn{color:#82aaff}
  .code-body .str{color:#c3e88d}
  .code-body .num2{color:#f78c6c}
  .code-body .com{color:rgba(255,255,255,.35);font-style:italic}

  @media (max-width:900px){
    .dev-split{grid-template-columns:1fr;gap:32px}
  }

  .features{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .fcard{
    background:linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01));
    border:1px solid var(--line);border-radius:18px;padding:26px 24px;
    display:flex;flex-direction:column;gap:14px;
  }
  .fcard .num{font-size:11px;letter-spacing:.18em;color:var(--faint);font-weight:500}
  .fcard h4{margin:0;font-size:19px;font-weight:600;letter-spacing:-0.02em;color:var(--ink)}
  .fcard p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}

  .fviz{height:120px;border-radius:12px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.05);position:relative;overflow:hidden;margin-bottom:6px}

  .v1{display:flex;align-items:center;justify-content:center;padding:0 20px;gap:10px;height:100%}
  .v1 .from,.v1 .to{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,.75);font-weight:500}
  .v1 .av{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:600;color:#0a0a0b;background:#ffffff}
  .v1 .line{flex:1;height:1.5px;background:#ffffff;position:relative;border-radius:1px;opacity:.85}
  .v1 .line::after{content:"1.4s";position:absolute;left:50%;top:-20px;transform:translateX(-50%);font-size:10px;color:#0a0a0b;font-weight:600;background:#ffffff;padding:2px 7px;border-radius:4px}

  .v2{padding:14px 18px;display:flex;flex-direction:column;gap:8px;justify-content:center;height:100%}
  .v2 .crow{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:rgba(255,255,255,.75)}
  .v2 .crow b{color:#ffffff;font-weight:600}
  .v2 .crow .chip{font-size:10px;padding:2px 7px;border-radius:999px;background:#ffffff;color:#0a0a0b;font-weight:500;letter-spacing:.04em}

  .v3{padding:14px 16px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:rgba(255,255,255,.6);line-height:1.6;height:100%;display:flex;flex-direction:column;justify-content:center}
  .v3 .kw{color:#ffffff;font-weight:600}
  .v3 .str{color:#e9d9b6}
  .v3 .com{color:rgba(255,255,255,.3)}

  .pricing{position:relative;z-index:10;padding:32px 40px 96px}
  .pricing-header{text-align:center;margin-bottom:48px}
  .pricing-header .tag{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;font-weight:600}
  .pricing-header h2{font-size:clamp(32px,3.4vw,46px);font-weight:700;letter-spacing:-0.035em;line-height:1.05;margin:0 0 12px;color:var(--ink)}
  .pricing-header p{color:var(--muted);font-size:16px;max-width:560px;margin:0 auto}
  .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1200px;margin:0 auto}
  .price-card{
    width:100%;
    background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    border:1px solid var(--line);border-radius:22px;
    box-shadow:0 30px 60px rgba(0,0,0,.35);
    padding:36px 32px 32px;text-align:left;
    display:flex;flex-direction:column;
  }
  .price-card.popular{
    border-color:rgba(139,92,246,0.5);
    background:linear-gradient(180deg, rgba(139,92,246,.08), rgba(139,92,246,.02));
    box-shadow:0 30px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(139,92,246,0.3);
  }
  .price-card .tag{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;font-weight:600}
  .price-card h3{margin:0 0 6px;font-size:22px;font-weight:600;letter-spacing:-0.02em;color:var(--ink)}
  .price-card .desc{margin:0 0 26px;color:var(--muted);font-size:14px;line-height:1.55}
  .price-num{display:flex;align-items:baseline;gap:6px;margin-bottom:26px}
  .price-num .dollar{font-size:22px;color:var(--muted);font-weight:500}
  .price-num .amt{font-size:64px;font-weight:600;letter-spacing:-0.04em;line-height:1;color:var(--ink)}
  .price-num .per{color:var(--muted);font-size:14px;letter-spacing:-0.01em;margin-left:4px}
  .feat{list-style:none;padding:0;margin:0 0 28px;display:flex;flex-direction:column;gap:11px;flex:1}
  .feat li{display:flex;align-items:flex-start;gap:11px;color:var(--ink-2);font-size:13.5px;line-height:1.5}
  .feat svg{flex:0 0 auto;color:#ffffff;margin-top:2px}
  .price-card .btn-primary{width:100%;justify-content:center;height:44px}

  @media (max-width:980px){
    .pricing-grid{grid-template-columns:1fr;max-width:480px;margin:0 auto}
  }

  .faq{display:flex;flex-direction:column;gap:0;max-width:760px;margin:0 auto;border-top:1px solid var(--line)}
  .qa{border-bottom:1px solid var(--line)}
  .qa summary{
    list-style:none;cursor:pointer;padding:22px 8px;
    display:flex;justify-content:space-between;align-items:center;gap:24px;
    font-size:17px;font-weight:500;letter-spacing:-0.015em;color:var(--ink);
  }
  .qa summary::-webkit-details-marker{display:none}
  .qa summary .pm{
    width:24px;height:24px;border-radius:50%;flex:0 0 auto;
    border:1px solid rgba(255,255,255,.25);
    display:flex;align-items:center;justify-content:center;
    transition:transform .25s ease, background .25s ease, border-color .2s ease;
  }
  .qa summary .pm svg path{stroke:#ffffff}
  .qa[open] summary .pm{background:#ffffff;border-color:#ffffff;transform:rotate(45deg)}
  .qa[open] summary .pm svg path{stroke:#0a0a0b}
  .qa .ans{padding:0 8px 22px;color:var(--muted);font-size:14.5px;line-height:1.6;max-width:600px}

  footer.site{
    position:relative;z-index:10;border-top:1px solid var(--line);
    padding:60px 40px 40px;max-width:1200px;margin:60px auto 0;
  }
  .foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:48px;margin-bottom:40px}
  .foot-grid .col h5{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);font-weight:500;margin:0 0 14px}
  .foot-grid .col a{display:block;font-size:14px;color:var(--ink-2);margin-bottom:9px;transition:color .15s ease}
  .foot-grid .col a:hover{color:#ffffff}
  .foot-grid .about p{font-size:13.5px;color:var(--muted);line-height:1.55;margin:14px 0 0;max-width:280px}
  .foot-bot{display:flex;justify-content:space-between;align-items:center;padding-top:24px;border-top:1px solid var(--line);font-size:12.5px;color:var(--muted)}
  .foot-bot a{color:var(--ink-2)}

  @media (max-width:1100px){
    .dash-wrap{width:900px}
  }
  @media (max-width:980px){
    .hero{grid-template-columns:1fr;gap:36px;padding:120px 24px 40px}
    .stage{height:480px;overflow:hidden}
    .dash-wrap{position:relative;top:auto;transform:none;width:1040px;max-width:none}
    .merch{grid-template-columns:1fr;gap:32px}
    .dev-split{grid-template-columns:1fr}
    .features{grid-template-columns:repeat(2,1fr)}
    .foot-grid{grid-template-columns:1fr 1fr;gap:32px}
    nav.midnav{display:none}
    .scene{height:480px}
    .phone{width:220px;height:440px}
  }
  @media (max-width:640px){
    .features{grid-template-columns:1fr}
    .cta-row{flex-direction:column;align-items:stretch}
    .cta-row .btn{width:100%}
  }
  @media (max-width:560px){
    header{padding:14px 18px}
    .btn{height:36px;padding:0 14px;font-size:13px}
    .cta-row .btn{height:42px;font-size:14px}
    h1{font-size:36px}
    .dev-copy h2{font-size:28px}
    p.sub{font-size:15px}
    .section{padding:64px 20px}
    .foot-grid{grid-template-columns:1fr}
    .phone{width:200px;height:400px}
    .ph-check{width:90px;height:90px}
    .ph-check svg{width:36px;height:36px}
    .ph-amt{font-size:48px}
    .ph-amt .cur{font-size:16px;vertical-align:10px}
    .ph-sub{font-size:12px}
    .chip-f{font-size:10px;padding:6px 10px 6px 8px}
    .chip-f .ic{width:18px;height:18px}
    .chip-f .ic svg{width:11px;height:11px}
  }
`;

export default function DberiLanding() {
  const handleCheckout = async (priceId: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

        <header>
          <div className="wm"><span className="glyph">d</span>dberi</div>
          <nav className="midnav">
            <a href="#merchants">Merchants</a>
            <a href="#how">How it works</a>
            <a href="#api">Developers</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <nav className="actions">
            <a className="btn btn-ghost" href="https://dashboard.dberi.com">Log in</a>
            <a className="btn btn-primary" href="#book">
              Book a demo
              <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </nav>
        </header>

        <main>
          <section className="hero">
            <div className="copy">
              <h1>Payments built for merchants.</h1>

              <p className="sub">Take payments at the counter, on the go, or online. Watch your sales land in real time on the dberi dashboard.</p>

              <div className="cta-row">
                <a className="btn btn-primary" href="#book">
                  Book a demo
                  <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <span className="meta">$10/month · no transaction fees</span>
              </div>
            </div>

            <div className="stage">
              <div className="dash-wrap">
                <div className="chrome">
                  <div className="tl"><i className="r"></i><i className="y"></i><i className="g"></i></div>
                  <div className="url">dashboard.dberi.com</div>
                </div>

                <div className="dash">
                  <aside className="side">
                    <div className="brand">
                      <div className="icn">
                        <svg viewBox="0 0 16 16" fill="none"><path d="M2 6h12v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z M2 6V4a1 1 0 011-1h10a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                      </div>
                      <b>Dberi Official</b>
                    </div>

                    <div className="navgrp">
                      <div className="nv act">
                        <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.3"/></svg>
                        Balance
                      </div>
                      <div className="nv">
                        <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
                        Register
                      </div>
                      <div className="nv">
                        <svg viewBox="0 0 16 16" fill="none"><path d="M8 2l5.5 3v6L8 14l-5.5-3V5L8 2z M2.5 5L8 8l5.5-3 M8 8v6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                        Items
                      </div>
                      <div className="nv">
                        <svg viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v6 M6.5 7H9a1 1 0 010 2H7a1 1 0 000 2h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                        Sales
                      </div>
                    </div>

                    <div className="navgrp">
                      <div className="lbl">Actions</div>
                      <div className="nv"><svg viewBox="0 0 16 16" fill="none"><path d="M13 8a5 5 0 11-1.5-3.5 M13 3v3h-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Refund</div>
                      <div className="nv"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5.2v5.6M5.2 8h5.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>Pay Employees</div>
                    </div>

                    <div className="navgrp">
                      <div className="lbl">Manage</div>
                      <div className="nv"><svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2.3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c.5-2.2 2.2-3.5 4-3.5s3.5 1.3 4 3.5 M11 7a2 2 0 100-4 M14 12c-.3-1.5-1.3-2.5-2.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>Team</div>
                      <div className="nv"><svg viewBox="0 0 16 16" fill="none"><path d="M5.5 4.5L2 8l3.5 3.5 M10.5 4.5L14 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Developer</div>
                    </div>

                    <div className="foot">
                      <div className="nv"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1.5v1.7 M8 12.8v1.7 M3.4 3.4l1.2 1.2 M11.4 11.4l1.2 1.2 M1.5 8h1.7 M12.8 8h1.7 M3.4 12.6l1.2-1.2 M11.4 4.6l1.2-1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>Settings</div>
                      <div className="nv"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M6.3 6.3a1.7 1.7 0 113 1c-.4.4-1 .6-1 1.3 M8 11.3h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>Help center</div>
                      <div className="me"><div className="av">DO</div><span>Dberi Official</span></div>
                    </div>
                  </aside>

                  <div className="panel">
                    <div className="topbar">
                      <div>
                        <div className="crumb">Dberi Official</div>
                        <div className="grosswrap">
                          <span className="grosslbl">Gross sales <span className="info">i</span></span>
                          <div className="tabs"><span>Today</span><span>Week</span><span>Month</span><span className="act">All</span></div>
                        </div>
                        <div className="gross"><span className="cur">BSD $</span><span className="n">1,047.00</span></div>
                        <div className="txns">24 transactions</div>
                      </div>

                      <div className="topright">
                        <button className="newsale">
                          <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                          New sale
                        </button>
                        <div className="acct"><span className="av">DO</span>Dberi Official
                          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 4l3 3 3-3" stroke="#666" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                        </div>
                      </div>
                    </div>

                    <div className="rev">
                      <div className="row1">
                        <div>
                          <div className="lbl">Revenue</div>
                          <div className="val"><b>BSD $1,047.00</b><span className="up">+3490%</span></div>
                        </div>
                        <div className="range">Last 24 hours
                          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 4l3 3 3-3" stroke="#666" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                        </div>
                      </div>
                      <div className="chart">
                        <svg viewBox="0 0 600 90" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0a0a0a" stopOpacity=".25"/>
                              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <path d="M0,82 L260,82 C275,82 285,78 295,55 C305,28 315,5 330,5 C345,5 355,28 365,55 C375,78 385,82 400,82 L600,82" stroke="#0a0a0a" strokeWidth="1.6" fill="none"/>
                          <path d="M0,82 L260,82 C275,82 285,78 295,55 C305,28 315,5 330,5 C345,5 355,28 365,55 C375,78 385,82 400,82 L600,82 L600,90 L0,90 Z" fill="url(#g1)"/>
                        </svg>
                      </div>
                      <div className="xax"><span>16:00</span><span>20:00</span><span>0:00</span><span>4:00</span><span>8:00</span><span>12:00</span></div>
                    </div>

                    <div className="sales-h">
                      <div>
                        <h4>Sales</h4>
                        <div className="desc">Recent transactions across this register.</div>
                      </div>
                      <div className="va">View all <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="#222" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                    </div>

                    <table className="sales">
                      <thead>
                        <tr><th>Customer</th><th>Status</th><th className="r">Amount</th><th className="r">Time</th></tr>
                      </thead>
                      <tbody>
                        <tr><td><div className="cust"><span className="cav a">JD</span><div><div className="cnm">John Doe</div><div className="cid">a91e62f0</div></div></div></td><td><span className="status">Created</span></td><td className="r">BSD $35.00</td><td className="r muted">11:06 PM</td></tr>
                        <tr><td><div className="cust"><span className="cav b">AB</span><div><div className="cnm">Anna Boo</div><div className="cid">7d2c14a8</div></div></div></td><td><span className="status ok">Completed</span></td><td className="r">BSD $30.00</td><td className="r muted">11:05 PM</td></tr>
                        <tr><td><div className="cust"><span className="cav c">MJ</span><div><div className="cnm">Maya Joseph</div><div className="cid">3f88b1d2</div></div></div></td><td><span className="status">Created</span></td><td className="r">BSD $105.00</td><td className="r muted">10:31 PM</td></tr>
                        <tr><td><div className="cust"><span className="cav d">AT</span><div><div className="cnm">Andre Thompson</div><div className="cid">e16240ef</div></div></div></td><td><span className="status">Created</span></td><td className="r">BSD $84.00</td><td className="r muted">6:36 PM</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="merchants">
            <div className="sec-h">
              <span className="eyebrow">Built for merchants</span>
              <h2>Everything you need to get paid.</h2>
              <p>From the food truck to the boutique to the dive shop. dberi gives merchants a register, a dashboard, and a way for any customer to pay you instantly.</p>
            </div>

            <div className="merch">
              <div className="mbig">
                <div className="copy">
                  <h3>Take payments anywhere.</h3>
                  <p>Stand at the counter, walk the floor, or sell at the market. Customers scan or enter your @handle — you see the sale on your phone in seconds.</p>
                </div>

                <div className="scene">
                  <div className="chip-f c2">
                    <span className="ic"><svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M9 9h2v2H9zM13 9h1M9 13h2M13 11v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
                    Scan QR
                  </div>
                  <div className="chip-f c3">
                    <span className="ic"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M11 8v1.5a2 2 0 002 2c1.4 0 2-1.1 2-2.7C15 4.5 12 2 8 2 4.5 2 1 4.5 1 8.5S4.5 14 8 14c2 0 3.2-.4 4.3-1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
                    @handle
                  </div>

                  <div className="conn">
                    <svg viewBox="0 0 400 340" preserveAspectRatio="none" fill="none">
                      <path d="M340 160 C290 170, 250 165, 220 170" stroke="rgba(255,255,255,.18)" strokeWidth="1" strokeDasharray="2 4"/>
                      <path d="M80 280 C130 270, 170 260, 200 240" stroke="rgba(255,255,255,.18)" strokeWidth="1" strokeDasharray="2 4"/>
                    </svg>
                  </div>

                  <div className="phone">
                    <div className="notch"></div>
                    <div className="stat"><span>9:41</span><span>●●●</span></div>
                    <div className="scr">
                      <div className="ph-stack">
                        <div className="ph-check">
                          <svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5L10.5 17L18 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="ph-amt"><span className="cur">$</span>42.50</div>
                        <div className="ph-sub">Payment received</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mcol">
                <div className="msm">
                  <div className="ic"><svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4.5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M2 8h14" stroke="currentColor" strokeWidth="1.4"/></svg></div>
                  <h4>One dashboard for the whole business.</h4>
                  <p>Sales, payouts, refunds, and team in one view. Open it on your laptop or your phone.</p>
                </div>
                <div className="msm">
                  <div className="ic"><svg viewBox="0 0 18 18" fill="none"><path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/></svg></div>
                  <h4>Payouts to your bank, daily.</h4>
                  <p>Money lands in your existing local bank account every business day. No new account to open.</p>
                </div>
                <div className="msm">
                  <div className="ic"><svg viewBox="0 0 18 18" fill="none"><rect x="2.5" y="3" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7h8M5 10h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></div>
                  <h4>Items, receipts, refunds.</h4>
                  <p>Sell from a catalog, print or email receipts, and refund a sale with one tap when you need to.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="how">
            <div className="dev-split">
              <div className="dev-copy">
                <span className="eyebrow">For developers</span>
                <h2>A clean API. Real docs. Sandbox keys.</h2>
                <p>Drop dberi into any product in an afternoon. REST endpoints, signed webhooks, and server SDKs for the languages you actually use.</p>

                <ul className="devlist">
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>REST + webhooks</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Node, Python &amp; Go SDKs</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Free sandbox keys, no credit card</li>
                </ul>

                <div className="cta-row" style={{ marginTop: "8px" }}>
                  <a className="btn btn-primary" href="https://docs.dberi.com" id="api">
                    Read the docs
                    <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </div>
              </div>

              <div className="code-card">
                <div className="code-head">
                  <div className="code-dots"><i></i><i></i><i></i></div>
                  <div className="code-file">charge.js</div>
                  <div className="code-copy">Copy</div>
                </div>
                <pre className="code-body"><span className="com">// Charge a customer for $42.50 BBD</span>
<span className="kw">const</span> charge = <span className="kw">await</span> dberi.charges.<span className="fn">create</span>(&#123;
  amount: <span className="num2">4250</span>,
  currency: <span className="str">"BBD"</span>,
  source: <span className="str">"tok_visa"</span>,
  description: <span className="str">"Roti &amp; pumpkin curry"</span>
&#125;);</pre>
              </div>
            </div>
          </section>

          <section className="section" id="faq">
            <div className="sec-h" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
              <span className="eyebrow">Questions</span>
              <h2>The fine print, in plain English.</h2>
            </div>

            <div className="faq">
              <details className="qa">
                <summary>Which countries is dberi live in?
                  <span className="pm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
                </summary>
                <div className="ans">We're rolling out across the Caribbean basin starting with Barbados, Jamaica, Trinidad &amp; Tobago, and the OECS. Reach out and we'll tell you when your island goes live.</div>
              </details>

              <details className="qa">
                <summary>Is there really no per-transaction fee?
                  <span className="pm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
                </summary>
                <div className="ans">Correct. $10 flat per month covers transfers, payouts, and merchant acceptance. We make money on optional services — FX conversion above a threshold, payroll, and our card program.</div>
              </details>

              <details className="qa">
                <summary>Do my customers need a dberi account to pay?
                  <span className="pm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
                </summary>
                <div className="ans">No. Customers can pay you from any local bank app, card, or a quick one-time link. dberi is the rail behind the scenes — they don't need to install anything new.</div>
              </details>

              <details className="qa">
                <summary>How long does it take to get set up?
                  <span className="pm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
                </summary>
                <div className="ans">Most merchants are taking their first payment the same day they sign up. Verification of your business and bank account usually takes under an hour.</div>
              </details>

              <details className="qa">
                <summary>What about regulation and compliance?
                  <span className="pm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
                </summary>
                <div className="ans">dberi operates as a licensed payment service provider in each jurisdiction we serve, with full KYC, AML, and consumer protections aligned to local central bank guidance.</div>
              </details>
            </div>
          </section>

          <section className="pricing" id="pricing">
            <div className="pricing-header">
              <span className="tag">Simple pricing</span>
              <h2>Choose your plan</h2>
              <p>Flat monthly rate for full access to dberi's payment rails. No per-transaction fees, no surprises.</p>
            </div>

            <div className="pricing-grid">
              <div className="price-card">
                <span className="tag">Small Business</span>
                <h3>Corner shops &amp; cafes</h3>
                <p className="desc">Perfect for small retailers, food trucks, and local shops just getting started.</p>

                <div className="price-num">
                  <span className="dollar">$</span><span className="amt">10</span><span className="per">/ month</span>
                </div>

                <ul className="feat">
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Accept payments in-store &amp; online</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Merchant dashboard</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Daily payouts to your bank</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Unlimited team members</li>
                </ul>

                <button className="btn btn-primary" onClick={() => handleCheckout('price_1Tc0xQCZX9LsXZgVc0CjFp82')}>
                  Get started
                  <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              <div className="price-card popular">
                <span className="tag">Professional</span>
                <h3>Restaurants &amp; boutiques</h3>
                <p className="desc">For established businesses with multiple staff and higher transaction volumes.</p>

                <div className="price-num">
                  <span className="dollar">$</span><span className="amt">25</span><span className="per">/ month</span>
                </div>

                <ul className="feat">
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Everything in Small Business</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Advanced analytics &amp; reporting</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Inventory management</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Priority support</li>
                </ul>

                <button className="btn btn-primary" onClick={() => handleCheckout('price_1Tc0xpCZX9LsXZgVCwB1VxI9')}>
                  Get started
                  <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              <div className="price-card">
                <span className="tag">Enterprise</span>
                <h3>Large retailers &amp; chains</h3>
                <p className="desc">Custom solutions for large businesses, franchises, and multi-location operations.</p>

                <div className="price-num">
                  <span className="dollar">$</span><span className="amt">100</span><span className="per">/ month</span>
                </div>

                <ul className="feat">
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Everything in Professional</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Multi-location management</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Custom API integrations</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Unlimited team members</li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Dedicated account manager</li>
                </ul>

                <a className="btn btn-primary" href="mailto:ivoine@dberi.com?subject=Enterprise%20Plan%20Inquiry">
                  Contact sales
                  <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="site">
          <div className="foot-grid">
            <div className="col about">
              <div className="wm"><span className="glyph">d</span>dberi</div>
              <p>Modern financial infrastructure built for the Caribbean region.</p>
            </div>
            <div className="col">
              <h5>Product</h5>
              <a href="#merchants">For merchants</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="https://dashboard.dberi.com">Dashboard</a>
            </div>
            <div className="col">
              <h5>Developers</h5>
              <a href="#api">API</a>
              <a href="https://docs.dberi.com">Documentation</a>
              <a href="https://status.dberi.com">Status</a>
              <a href="https://docs.dberi.com/changelog">Changelog</a>
            </div>
            <div className="col">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#book">Contact</a>
              <a href="#">Press</a>
            </div>
          </div>
          <div className="foot-bot">
            <div>© 2026 dberi. All rights reserved.</div>
            <div style={{ display: "flex", gap: "18px" }}><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a></div>
          </div>
        </footer>

    </>
  );
}
