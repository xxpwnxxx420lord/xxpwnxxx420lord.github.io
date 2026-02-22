import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Font injection ─── */
const injectFonts = () => {
  if (document.getElementById("jeez-fonts")) return;
  const l = document.createElement("link");
  l.id = "jeez-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap";
  document.head.appendChild(l);
};

/* ─── JSZip ─── */
const loadZip = () => new Promise((r, j) => {
  if (window.JSZip) return r(window.JSZip);
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
  s.onload = () => r(window.JSZip); s.onerror = j;
  document.head.appendChild(s);
});

/* ═══════════════════════════════════════════════════════
   ELEMENT CATALOG — every HTML element
═══════════════════════════════════════════════════════ */
const CATALOG = {
  "✦ Typography": [
    { tag:"h1", label:"Heading 1", content:"Heading One", defW:420, defH:58, defStyle:{ fontSize:"2.4rem", fontWeight:"800", lineHeight:"1.15" } },
    { tag:"h2", label:"Heading 2", content:"Heading Two", defW:380, defH:50, defStyle:{ fontSize:"1.85rem", fontWeight:"700" } },
    { tag:"h3", label:"Heading 3", content:"Heading Three", defW:320, defH:44, defStyle:{ fontSize:"1.45rem", fontWeight:"700" } },
    { tag:"h4", label:"Heading 4", content:"Heading Four", defW:280, defH:40, defStyle:{ fontSize:"1.2rem", fontWeight:"600" } },
    { tag:"h5", label:"Heading 5", content:"Heading Five", defW:240, defH:36 },
    { tag:"h6", label:"Heading 6", content:"Heading Six", defW:220, defH:32 },
    { tag:"p",  label:"Paragraph", content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", defW:440, defH:80, defStyle:{ lineHeight:"1.7" } },
    { tag:"span", label:"Span", content:"Inline text", defW:160, defH:30 },
    { tag:"strong", label:"Bold", content:"Bold text", defW:160, defH:30, defStyle:{ fontWeight:"bold" } },
    { tag:"em", label:"Italic", content:"Italic text", defW:160, defH:30, defStyle:{ fontStyle:"italic" } },
    { tag:"a",  label:"Link", content:"Click here", defW:160, defH:30, defStyle:{ color:"#6366f1" }, defAttr:{ href:"#" } },
    { tag:"blockquote", label:"Blockquote", content:"A thoughtful quote lives here, full of meaning.", defW:400, defH:80, defStyle:{ borderLeft:"4px solid #6366f1", paddingLeft:"1rem", fontStyle:"italic", color:"#666" } },
    { tag:"pre", label:"Preformatted", content:"const hello = 'world';", defW:400, defH:80, defStyle:{ fontFamily:"'Fira Code', monospace", background:"#1e1e2e", color:"#cba6f7", padding:"1rem", borderRadius:"8px", fontSize:"0.85rem" } },
    { tag:"code", label:"Inline Code", content:"console.log()", defW:200, defH:32, defStyle:{ fontFamily:"'Fira Code', monospace", background:"#1e1e2e", color:"#cba6f7", padding:"2px 8px", borderRadius:"4px", fontSize:"0.85rem" } },
    { tag:"mark", label:"Highlight", content:"Highlighted text", defW:200, defH:30, defStyle:{ background:"#fef08a", color:"#1a1a1a", padding:"1px 4px" } },
    { tag:"del", label:"Strikethrough", content:"Deleted text", defW:180, defH:30 },
    { tag:"ins", label:"Underline/Insert", content:"Inserted text", defW:200, defH:30, defStyle:{ textDecoration:"underline" } },
    { tag:"small", label:"Small Text", content:"Small print text", defW:180, defH:28, defStyle:{ fontSize:"0.75rem", color:"#888" } },
    { tag:"abbr", label:"Abbreviation", content:"HTML", defW:100, defH:28, defAttr:{ title:"HyperText Markup Language" } },
    { tag:"kbd", label:"Keyboard Key", content:"Ctrl+S", defW:100, defH:32, defStyle:{ fontFamily:"'Fira Code', monospace", border:"1px solid #ccc", padding:"1px 6px", borderRadius:"3px", background:"#f5f5f5", fontSize:"0.8rem" } },
    { tag:"cite", label:"Citation", content:"Author, Work Title", defW:220, defH:30, defStyle:{ fontStyle:"italic", color:"#6366f1" } },
    { tag:"dfn", label:"Definition", content:"Defined term", defW:180, defH:30, defStyle:{ fontStyle:"italic", fontWeight:"600" } },
    { tag:"var", label:"Variable", content:"x = 42", defW:120, defH:28, defStyle:{ fontStyle:"italic", color:"#f59e0b" } },
    { tag:"samp", label:"Sample Output", content:"Error: not found", defW:200, defH:30, defStyle:{ fontFamily:"'Fira Code', monospace", color:"#4ade80" } },
    { tag:"q",  label:"Quote", content:"Quoted text here", defW:200, defH:30 },
    { tag:"sub", label:"Subscript", content:"H₂O", defW:80, defH:28 },
    { tag:"sup", label:"Superscript", content:"E=mc²", defW:80, defH:28 },
    { tag:"time", label:"Time", content:"January 2025", defW:160, defH:28, defAttr:{ dateTime:"2025-01" } },
    { tag:"data", label:"Data", content:"42 items", defW:120, defH:28, defAttr:{ value:"42" } },
    { tag:"address", label:"Address", content:"123 Main St\nCity, State 00000", defW:240, defH:60, defStyle:{ fontStyle:"normal", lineHeight:"1.6" } },
  ],
  "⊞ Layout": [
    { tag:"div", label:"Div Block", content:"", defW:320, defH:120, defStyle:{ border:"2px dashed #d1d5db", padding:"1rem", background:"rgba(99,102,241,0.04)" } },
    { tag:"section", label:"Section", content:"", defW:500, defH:160, defStyle:{ border:"2px dashed #818cf8", padding:"1.5rem", background:"rgba(99,102,241,0.03)" } },
    { tag:"article", label:"Article", content:"", defW:480, defH:160, defStyle:{ border:"2px dashed #34d399", padding:"1.5rem", background:"rgba(52,211,153,0.03)" } },
    { tag:"header", label:"Header", content:"Site Header", defW:700, defH:70, defStyle:{ background:"#1e1e2e", color:"#fff", padding:"1rem 2rem", fontWeight:"700", fontSize:"1.3rem" } },
    { tag:"footer", label:"Footer", content:"© 2025 My Site", defW:700, defH:60, defStyle:{ background:"#1e1e2e", color:"#aaa", padding:"1rem 2rem", fontSize:"0.9rem" } },
    { tag:"nav",  label:"Navigation", content:"Home · About · Contact", defW:600, defH:52, defStyle:{ background:"rgba(99,102,241,0.1)", padding:"0.75rem 1.5rem", borderRadius:"8px" } },
    { tag:"main", label:"Main", content:"", defW:640, defH:300, defStyle:{ border:"2px dashed #f59e0b", padding:"2rem", background:"rgba(245,158,11,0.03)" } },
    { tag:"aside", label:"Aside / Sidebar", content:"Sidebar content", defW:240, defH:180, defStyle:{ borderLeft:"3px solid #6366f1", paddingLeft:"1rem", background:"rgba(99,102,241,0.04)" } },
    { tag:"hr",  label:"Horizontal Rule", content:"", defW:400, defH:10, defStyle:{ border:"none", borderTop:"2px solid #e5e7eb" } },
    { tag:"br",  label:"Line Break", content:"", defW:100, defH:20 },
  ],
  "◈ Media": [
    { tag:"img",    label:"Image", content:"", defW:380, defH:240, defAttr:{ src:"https://picsum.photos/seed/jeez1/760/480", alt:"Image" }, defStyle:{ borderRadius:"8px", objectFit:"cover", width:"100%", height:"100%" } },
    { tag:"video",  label:"Video", content:"", defW:480, defH:270, defAttr:{ controls:"true" }, defStyle:{ borderRadius:"8px", background:"#000", width:"100%", height:"100%" } },
    { tag:"audio",  label:"Audio", content:"", defW:320, defH:54, defAttr:{ controls:"true" } },
    { tag:"iframe", label:"iFrame Embed", content:"", defW:560, defH:360, defAttr:{ src:"https://www.openstreetmap.org/export/embed.html", title:"Map" }, defStyle:{ border:"none", borderRadius:"8px" } },
    { tag:"figure", label:"Figure", content:"<figcaption style='text-align:center;color:#666;font-size:0.85rem;margin-top:8px'>Image caption</figcaption>", defW:360, defH:200, defStyle:{ textAlign:"center" } },
    { tag:"canvas", label:"Canvas", content:"", defW:400, defH:200, defAttr:{ width:"400", height:"200" }, defStyle:{ border:"2px dashed #6366f1", borderRadius:"4px" } },
    { tag:"svg",    label:"SVG", content:`<circle cx="60" cy="60" r="50" fill="#6366f1" opacity="0.8"/><text x="60" y="65" text-anchor="middle" fill="white" font-size="14" font-weight="bold">SVG</text>`, defW:120, defH:120, defAttr:{ viewBox:"0 0 120 120", xmlns:"http://www.w3.org/2000/svg" } },
    { tag:"map",    label:"Image Map", content:"<area shape='rect' coords='0,0,100,100' href='#' alt='area'>", defW:200, defH:60, defAttr:{ name:"mymap" } },
    { tag:"picture",label:"Picture", content:"<source media='(min-width:650px)' srcset='https://picsum.photos/seed/lg/600/300'><img src='https://picsum.photos/seed/sm/300/200' alt='Responsive image' style='width:100%;border-radius:8px'>", defW:380, defH:220 },
  ],
  "⌨ Forms": [
    { tag:"button", label:"Button", content:"Click Me", defW:160, defH:44, defStyle:{ padding:"10px 24px", background:"#6366f1", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"700", fontSize:"0.95rem", letterSpacing:"0.01em" } },
    { tag:"input_text",     label:"Text Input",     content:"", defW:300, defH:44, defAttr:{ type:"text",     placeholder:"Enter text..." },          defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_email",    label:"Email Input",    content:"", defW:300, defH:44, defAttr:{ type:"email",    placeholder:"you@example.com" },         defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_password", label:"Password",       content:"", defW:300, defH:44, defAttr:{ type:"password", placeholder:"••••••••" },               defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_number",   label:"Number Input",   content:"", defW:220, defH:44, defAttr:{ type:"number",   placeholder:"0", min:"0", max:"100" },   defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_tel",      label:"Phone Input",    content:"", defW:280, defH:44, defAttr:{ type:"tel",      placeholder:"+1 (000) 000-0000" },       defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_url",      label:"URL Input",      content:"", defW:320, defH:44, defAttr:{ type:"url",      placeholder:"https://..." },             defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_search",   label:"Search Input",   content:"", defW:300, defH:44, defAttr:{ type:"search",   placeholder:"Search..." },               defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_date",     label:"Date Picker",    content:"", defW:220, defH:44, defAttr:{ type:"date" },   defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_time",     label:"Time Picker",    content:"", defW:180, defH:44, defAttr:{ type:"time" },   defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_datetime", label:"Datetime Local", content:"", defW:280, defH:44, defAttr:{ type:"datetime-local" }, defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_month",    label:"Month Picker",   content:"", defW:200, defH:44, defAttr:{ type:"month" },  defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_week",     label:"Week Picker",    content:"", defW:200, defH:44, defAttr:{ type:"week" },   defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"input_range",    label:"Range Slider",   content:"", defW:240, defH:44, defAttr:{ type:"range", min:"0", max:"100", value:"50" }, defStyle:{ accentColor:"#6366f1", width:"100%", cursor:"pointer" } },
    { tag:"input_color",    label:"Color Picker",   content:"", defW:80,  defH:50, defAttr:{ type:"color", value:"#6366f1" }, defStyle:{ border:"none", background:"none", cursor:"pointer" } },
    { tag:"input_file",     label:"File Upload",    content:"", defW:280, defH:44, defAttr:{ type:"file" } },
    { tag:"input_checkbox", label:"Checkbox",       content:"", defW:40,  defH:40, defAttr:{ type:"checkbox" }, defStyle:{ accentColor:"#6366f1", width:"20px", height:"20px", cursor:"pointer" } },
    { tag:"input_radio",    label:"Radio Button",   content:"", defW:40,  defH:40, defAttr:{ type:"radio" },    defStyle:{ accentColor:"#6366f1", width:"20px", height:"20px", cursor:"pointer" } },
    { tag:"input_hidden",   label:"Hidden Input",   content:"", defW:160, defH:30, defAttr:{ type:"hidden", value:"" } },
    { tag:"input_submit",   label:"Submit Button",  content:"", defW:160, defH:44, defAttr:{ type:"submit", value:"Submit" }, defStyle:{ padding:"10px 24px", background:"#10b981", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"700" } },
    { tag:"input_reset",    label:"Reset Button",   content:"", defW:140, defH:44, defAttr:{ type:"reset", value:"Reset" },  defStyle:{ padding:"10px 24px", background:"#ef4444", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"700" } },
    { tag:"textarea", label:"Textarea", content:"", defW:320, defH:140, defAttr:{ placeholder:"Your message...", rows:"4" }, defStyle:{ padding:"12px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem", resize:"vertical", width:"100%", boxSizing:"border-box" } },
    { tag:"select",   label:"Dropdown", content:"<option>Choose an option</option><option>Option A</option><option>Option B</option><option>Option C</option>", defW:260, defH:44, defStyle:{ padding:"10px 14px", border:"2px solid #e5e7eb", borderRadius:"8px", fontSize:"0.95rem" } },
    { tag:"form",     label:"Form Container", content:"", defW:400, defH:200, defStyle:{ border:"2px dashed #6366f1", padding:"1.5rem", borderRadius:"12px", background:"rgba(99,102,241,0.03)" } },
    { tag:"label",    label:"Label", content:"Field Label", defW:180, defH:32, defStyle:{ fontSize:"0.875rem", fontWeight:"600", color:"#374151" } },
    { tag:"legend",   label:"Legend", content:"Group Title", defW:160, defH:32, defStyle:{ fontWeight:"600", padding:"0 8px" } },
    { tag:"fieldset", label:"Fieldset", content:"<legend style='font-weight:600;padding:0 8px'>Group</legend>", defW:360, defH:160, defStyle:{ border:"2px solid #e5e7eb", borderRadius:"8px", padding:"1rem" } },
    { tag:"datalist", label:"Datalist", content:"<option value='Apple'><option value='Banana'><option value='Cherry'>", defW:200, defH:40, defAttr:{ id:"fruits" } },
    { tag:"output",   label:"Output", content:"Result will appear here", defW:240, defH:36, defStyle:{ padding:"6px 12px", border:"2px solid #e5e7eb", borderRadius:"6px", background:"#f9fafb" } },
    { tag:"meter",    label:"Meter", content:"", defW:220, defH:36, defAttr:{ value:"0.7", min:"0", max:"1" }, defStyle:{ accentColor:"#6366f1" } },
    { tag:"progress", label:"Progress Bar", content:"", defW:280, defH:36, defAttr:{ value:"70", max:"100" }, defStyle:{ accentColor:"#6366f1", width:"100%" } },
  ],
  "☰ Lists": [
    { tag:"ul", label:"Bullet List",    content:"<li>First item</li><li>Second item</li><li>Third item</li>", defW:280, defH:100, defStyle:{ paddingLeft:"1.5rem", lineHeight:"1.9" } },
    { tag:"ol", label:"Numbered List",  content:"<li>First item</li><li>Second item</li><li>Third item</li>", defW:280, defH:100, defStyle:{ paddingLeft:"1.5rem", lineHeight:"1.9" } },
    { tag:"li", label:"List Item",      content:"A list item", defW:200, defH:32, defStyle:{ lineHeight:"1.6" } },
    { tag:"dl", label:"Definition List",content:"<dt style='font-weight:700'>Term</dt><dd style='margin:0 0 8px 1rem;color:#666'>Definition goes here</dd><dt style='font-weight:700'>Term 2</dt><dd style='margin:0 0 8px 1rem;color:#666'>Another definition</dd>", defW:320, defH:120 },
    { tag:"dt", label:"Definition Term",content:"Term", defW:160, defH:32, defStyle:{ fontWeight:"700" } },
    { tag:"dd", label:"Definition Data",content:"Description here", defW:280, defH:32, defStyle:{ marginLeft:"1rem", color:"#666" } },
    { tag:"menu",label:"Menu List",     content:"<li>Menu Item 1</li><li>Menu Item 2</li>", defW:200, defH:80, defStyle:{ listStyle:"none", padding:"0" } },
  ],
  "⊟ Table": [
    { tag:"table", label:"Table", defW:500, defH:180, defStyle:{ borderCollapse:"collapse", width:"100%" }, content:`<thead><tr><th style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;text-align:left">Name</th><th style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;text-align:left">Role</th><th style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;text-align:left">Status</th></tr></thead><tbody><tr><td style="padding:10px 14px;border:1px solid #e5e7eb">Alice Smith</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Designer</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Active</td></tr><tr style="background:#f9fafb"><td style="padding:10px 14px;border:1px solid #e5e7eb">Bob Jones</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Developer</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Active</td></tr></tbody>` },
    { tag:"thead",  label:"Table Head",    content:"<tr><th style='padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb'>Column A</th><th style='padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb'>Column B</th></tr>", defW:320, defH:50 },
    { tag:"tbody",  label:"Table Body",    content:"<tr><td style='padding:8px 12px;border:1px solid #e5e7eb'>Data</td><td style='padding:8px 12px;border:1px solid #e5e7eb'>Data</td></tr>", defW:320, defH:50 },
    { tag:"tfoot",  label:"Table Footer",  content:"<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;font-weight:700' colspan='2'>Total</td></tr>", defW:320, defH:50 },
    { tag:"tr",     label:"Table Row",     content:"<td style='padding:8px 12px;border:1px solid #e5e7eb'>Cell 1</td><td style='padding:8px 12px;border:1px solid #e5e7eb'>Cell 2</td>", defW:320, defH:44 },
    { tag:"td",     label:"Table Cell",    content:"Cell Data", defW:160, defH:40, defStyle:{ border:"1px solid #e5e7eb", padding:"8px 12px" } },
    { tag:"th",     label:"Table Header",  content:"Column Name", defW:160, defH:40, defStyle:{ border:"1px solid #e5e7eb", padding:"8px 12px", background:"#f9fafb", fontWeight:"700" } },
    { tag:"caption",label:"Table Caption", content:"Table Caption", defW:320, defH:32, defStyle:{ textAlign:"center", fontWeight:"600", color:"#666", marginBottom:"8px" } },
    { tag:"colgroup",label:"Col Group",    content:"<col style='background:#f9fafb'><col>", defW:200, defH:32 },
  ],
  "◎ Interactive": [
    { tag:"details", label:"Accordion", defW:380, defH:80, defStyle:{ border:"2px solid #e5e7eb", borderRadius:"10px", overflow:"hidden" }, content:"<summary style='cursor:pointer;padding:14px 18px;font-weight:600;background:#f9fafb;user-select:none'>▶ Click to expand</summary><div style='padding:14px 18px;color:#555;line-height:1.7'>Revealed content goes here. Add any HTML you want inside.</div>" },
    { tag:"summary", label:"Summary",   content:"Click to toggle", defW:280, defH:44, defStyle:{ cursor:"pointer", padding:"10px 14px", background:"#f9fafb", borderRadius:"8px", fontWeight:"600", userSelect:"none" } },
    { tag:"dialog",  label:"Dialog",    content:"<p style='font-weight:700;font-size:1.1rem;margin-bottom:12px'>Dialog Title</p><p style='color:#555;line-height:1.6'>Dialog content goes here.</p><button style='margin-top:16px;padding:8px 18px;background:#6366f1;color:#fff;border:none;border-radius:6px;cursor:pointer'>Close</button>", defW:400, defH:200, defStyle:{ background:"#fff", border:"2px solid #e5e7eb", borderRadius:"12px", padding:"24px", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" } },
  ],
  "◈ Semantic": [
    { tag:"main",    label:"Main Content", content:"", defW:640, defH:240, defStyle:{ border:"2px dashed #f59e0b", padding:"1.5rem", borderRadius:"8px", background:"rgba(245,158,11,0.02)" } },
    { tag:"figure",  label:"Figure",       content:"<figcaption style='text-align:center;color:#888;font-size:0.85rem;margin-top:8px;font-style:italic'>Figure caption here</figcaption>", defW:320, defH:100 },
    { tag:"figcaption",label:"Figcaption", content:"Image caption", defW:260, defH:30, defStyle:{ textAlign:"center", color:"#888", fontStyle:"italic", fontSize:"0.85rem" } },
    { tag:"header",  label:"Site Header",  content:"My Website", defW:700, defH:68, defStyle:{ background:"#1e1e2e", color:"#fff", padding:"1rem 2rem", fontWeight:"800", fontSize:"1.4rem", display:"flex", alignItems:"center" } },
    { tag:"footer",  label:"Site Footer",  content:"© 2025 My Website. All rights reserved.", defW:700, defH:60, defStyle:{ background:"#1e1e2e", color:"rgba(255,255,255,0.5)", padding:"1rem 2rem", fontSize:"0.875rem" } },
    { tag:"nav",     label:"Nav Bar",      content:"<a href='#' style='color:inherit;text-decoration:none;margin-right:24px;font-weight:500'>Home</a><a href='#' style='color:inherit;text-decoration:none;margin-right:24px;font-weight:500'>About</a><a href='#' style='color:inherit;text-decoration:none;font-weight:500'>Contact</a>", defW:500, defH:56, defStyle:{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 2rem", display:"flex", alignItems:"center" } },
    { tag:"section", label:"Section",      content:"", defW:600, defH:200, defStyle:{ border:"2px dashed #818cf8", padding:"2rem", borderRadius:"8px" } },
    { tag:"article", label:"Article",      content:"<h2 style='font-weight:700;margin-bottom:8px'>Article Title</h2><p style='color:#666;line-height:1.7'>Article content goes here.</p>", defW:480, defH:140, defStyle:{ border:"2px dashed #34d399", padding:"1.5rem", borderRadius:"8px" } },
    { tag:"aside",   label:"Aside",        content:"<strong>Sidebar</strong><br>Extra content here.", defW:240, defH:140, defStyle:{ borderLeft:"4px solid #6366f1", padding:"1rem", background:"#f5f3ff", borderRadius:"0 8px 8px 0" } },
  ],
  "⟨/⟩ Code & Embed": [
    { tag:"__html__",  label:"Raw HTML Embed",  content:"<div style='padding:16px;background:#1e1e2e;border-radius:8px;color:#cba6f7;font-family:monospace'><!-- Your HTML here --></div>", defW:400, defH:120, isEmbed:true },
    { tag:"__script__",label:"Script Block",    content:"<script>\n  // JavaScript runs in preview\n  console.log('Hello, JeezMum!');\n<\/script>", defW:400, defH:100, isEmbed:true },
    { tag:"__style__", label:"CSS Style Block", content:"<style>\n  .custom { color: #6366f1; font-weight: bold; }\n<\/style>", defW:400, defH:100, isEmbed:true },
    { tag:"iframe",    label:"Website Embed",   content:"", defW:640, defH:400, defAttr:{ src:"https://www.openstreetmap.org/export/embed.html", title:"Embedded content" }, defStyle:{ border:"none", borderRadius:"10px", width:"100%", height:"100%" } },
  ],
};

let _uid = 1;
const uid = () => `el_${_uid++}_${Date.now()}`;

const allCatalogItems = Object.values(CATALOG).flat();

const createElement = (rawTag, x, y) => {
  const meta = allCatalogItems.find(i => i.tag === rawTag) || {};
  const isInputTag = rawTag.startsWith("input_");
  const isEmbed = meta.isEmbed || false;
  const realTag = isEmbed ? "div" : isInputTag ? "input" : rawTag;
  const inputType = isInputTag ? rawTag.split("_").slice(1).join("-") : undefined;
  return {
    id: uid(), rawTag, tag: realTag,
    x, y,
    w: meta.defW || 280, h: meta.defH || 48,
    content: meta.content ?? "",
    styles: { color: "#1a1a1a", boxSizing: "border-box", ...(meta.defStyle || {}) },
    attrs: { ...(meta.defAttr || {}), ...(inputType ? { type: inputType } : {}) },
    isEmbed, locked: false, zIndex: 1,
  };
};

/* ─── Style fields for right panel ─── */
const STYLE_FIELDS = [
  { section: "Typography" },
  { key:"color",         label:"Text Color",    type:"color" },
  { key:"fontSize",      label:"Font Size",     type:"text", ph:"1rem" },
  { key:"fontWeight",    label:"Font Weight",   type:"sel", opts:["100","200","300","400","500","600","700","800","900","bold","normal","lighter","bolder"] },
  { key:"fontFamily",    label:"Font Family",   type:"text", ph:"inherit" },
  { key:"fontStyle",     label:"Font Style",    type:"sel", opts:["normal","italic","oblique"] },
  { key:"textAlign",     label:"Text Align",    type:"sel", opts:["left","center","right","justify"] },
  { key:"lineHeight",    label:"Line Height",   type:"text", ph:"1.5" },
  { key:"letterSpacing", label:"Letter Spacing",type:"text", ph:"0" },
  { key:"textDecoration",label:"Text Deco",     type:"sel", opts:["none","underline","line-through","overline"] },
  { key:"textTransform", label:"Transform",     type:"sel", opts:["none","uppercase","lowercase","capitalize"] },
  { key:"textShadow",    label:"Text Shadow",   type:"text", ph:"none" },
  { key:"whiteSpace",    label:"White Space",   type:"sel", opts:["normal","nowrap","pre","pre-wrap","pre-line"] },
  { section: "Background" },
  { key:"backgroundColor",label:"BG Color",    type:"color" },
  { key:"background",    label:"BG (advanced)", type:"text", ph:"linear-gradient(...)" },
  { key:"backgroundImage",label:"BG Image",    type:"text", ph:"url('...')" },
  { key:"backgroundSize",label:"BG Size",      type:"sel", opts:["cover","contain","auto","100% 100%"] },
  { key:"backgroundPosition",label:"BG Position",type:"sel",opts:["center","top","bottom","left","right","top left","top right","bottom left","bottom right"] },
  { key:"backgroundRepeat",label:"BG Repeat",  type:"sel", opts:["no-repeat","repeat","repeat-x","repeat-y"] },
  { key:"opacity",       label:"Opacity",       type:"text", ph:"1" },
  { section: "Spacing" },
  { key:"padding",       label:"Padding",       type:"text", ph:"0" },
  { key:"paddingTop",    label:"Pad Top",       type:"text", ph:"0" },
  { key:"paddingRight",  label:"Pad Right",     type:"text", ph:"0" },
  { key:"paddingBottom", label:"Pad Bottom",    type:"text", ph:"0" },
  { key:"paddingLeft",   label:"Pad Left",      type:"text", ph:"0" },
  { key:"margin",        label:"Margin",        type:"text", ph:"0" },
  { section: "Border" },
  { key:"border",        label:"Border",        type:"text", ph:"none" },
  { key:"borderTop",     label:"Border Top",    type:"text", ph:"none" },
  { key:"borderRight",   label:"Border Right",  type:"text", ph:"none" },
  { key:"borderBottom",  label:"Border Bottom", type:"text", ph:"none" },
  { key:"borderLeft",    label:"Border Left",   type:"text", ph:"none" },
  { key:"borderRadius",  label:"Radius",        type:"text", ph:"0" },
  { key:"borderColor",   label:"Border Color",  type:"color" },
  { key:"outline",       label:"Outline",       type:"text", ph:"none" },
  { section: "Shadow & Effects" },
  { key:"boxShadow",     label:"Box Shadow",    type:"text", ph:"none" },
  { key:"filter",        label:"Filter",        type:"text", ph:"none" },
  { key:"backdropFilter",label:"Backdrop Blur", type:"text", ph:"none" },
  { key:"mixBlendMode",  label:"Blend Mode",    type:"sel", opts:["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion"] },
  { section: "Layout" },
  { key:"display",       label:"Display",       type:"sel", opts:["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none","contents"] },
  { key:"flexDirection", label:"Flex Dir",      type:"sel", opts:["row","column","row-reverse","column-reverse"] },
  { key:"flexWrap",      label:"Flex Wrap",     type:"sel", opts:["nowrap","wrap","wrap-reverse"] },
  { key:"justifyContent",label:"Justify",       type:"sel", opts:["flex-start","flex-end","center","space-between","space-around","space-evenly","stretch"] },
  { key:"alignItems",    label:"Align Items",   type:"sel", opts:["flex-start","flex-end","center","stretch","baseline"] },
  { key:"alignContent",  label:"Align Content", type:"sel", opts:["flex-start","flex-end","center","space-between","space-around","stretch"] },
  { key:"gap",           label:"Gap",           type:"text", ph:"0" },
  { key:"gridTemplateColumns",label:"Grid Cols",type:"text", ph:"1fr 1fr" },
  { key:"gridTemplateRows",   label:"Grid Rows",type:"text", ph:"auto" },
  { key:"overflow",      label:"Overflow",      type:"sel", opts:["visible","hidden","scroll","auto"] },
  { key:"overflowX",     label:"Overflow X",    type:"sel", opts:["visible","hidden","scroll","auto"] },
  { key:"overflowY",     label:"Overflow Y",    type:"sel", opts:["visible","hidden","scroll","auto"] },
  { section: "Interaction" },
  { key:"cursor",        label:"Cursor",        type:"sel", opts:["default","pointer","text","move","grab","grabbing","crosshair","not-allowed","wait","zoom-in","zoom-out","none"] },
  { key:"userSelect",    label:"User Select",   type:"sel", opts:["auto","none","text","all"] },
  { key:"pointerEvents", label:"Pointer Events",type:"sel", opts:["auto","none"] },
  { key:"resize",        label:"Resize",        type:"sel", opts:["none","both","horizontal","vertical"] },
  { section: "Animation" },
  { key:"transition",    label:"Transition",    type:"text", ph:"all 0.2s ease" },
  { key:"transform",     label:"Transform",     type:"text", ph:"none" },
  { key:"animation",     label:"Animation",     type:"text", ph:"none" },
  { section: "Advanced" },
  { key:"zIndex",        label:"Z-Index",       type:"text", ph:"auto" },
  { key:"objectFit",     label:"Object Fit",    type:"sel", opts:["fill","contain","cover","none","scale-down"] },
  { key:"listStyleType", label:"List Style",    type:"text", ph:"disc" },
  { key:"appearance",    label:"Appearance",    type:"sel", opts:["auto","none"] },
  { key:"accentColor",   label:"Accent Color",  type:"color" },
];

/* ════════════════════════════════════════
   THEME TOKENS
════════════════════════════════════════ */
const DARK = {
  bg:"#07070f", sidebar:"#0c0c1a", border:"#1a1a2e", panelBg:"#0f0f1e",
  text:"#e2e8f0", textSub:"#555", accent:"#818cf8", accentHover:"#6366f1",
  card:"#111122", cardHover:"#1a1a3a", inputBg:"#080812", canvasBg:"#060610",
  canvasDot:"rgba(40,40,90,0.4)", toolbarBg:"#0b0b17", menuBg:"#111122",
};
const LIGHT = {
  bg:"#f8f9ff", sidebar:"#fff", border:"#e5e7eb", panelBg:"#fff",
  text:"#111827", textSub:"#9ca3af", accent:"#6366f1", accentHover:"#4f46e5",
  card:"#fff", cardHover:"#f5f3ff", inputBg:"#f9fafb", canvasBg:"#f0f0fa",
  canvasDot:"rgba(99,102,241,0.15)", toolbarBg:"#fff", menuBg:"#fff",
};

/* ════════════════════════════════════════
   HOMEPAGE
════════════════════════════════════════ */
function HomePage({ onStart }) {
  const [hovered, setHovered] = useState(null);
  const features = [
    { icon:"🖱", title:"Drag & Drop Everything", desc:"Every HTML element imaginable. Drag from the panel, drop on canvas. Resize, reposition, stack — total freedom." },
    { icon:"🎨", title:"Full Style Control", desc:"Edit every CSS property directly. Colors, fonts, shadows, animations, filters — every single value is yours." },
    { icon:"⚡", title:"Right-Click Power", desc:"Custom context menu on every element. Duplicate, lock, layer, copy styles, delete — always one click away." },
    { icon:"🌓", title:"Light & Dark Theme", desc:"Builder chrome switches between light and dark. Your canvas stays exactly how you design it." },
    { icon:"✏", title:"Click to Edit Text", desc:"Click any text on canvas to edit inline. No modals, no panels — just click and type." },
    { icon:"📦", title:"Export as ZIP", desc:"Download your site as clean HTML + React. Open in browser, deploy anywhere, zero dependencies." },
  ];

  return (
    <div style={{ background: "linear-gradient(160deg, #07070f 0%, #0d0d20 50%, #120a1e 100%)", minHeight:"100vh", fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif", color:"#e2e8f0", overflow:"auto" }}>

      {/* Ambient glows */}
      <div style={{ position:"fixed", top:"-20%", left:"30%", width:600, height:600, background:"radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"-10%", right:"20%", width:500, height:500, background:"radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1 }}>
        {/* Nav */}
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 64px", height:66, borderBottom:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100, background:"rgba(7,7,15,0.8)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>⚡</span>
            <div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:15, color:"#f8fafc", letterSpacing:-0.5 }}>JeezMum</div>
              <div style={{ fontSize:8.5, color:"#3a3a6a", letterSpacing:1.5, textTransform:"uppercase", marginTop:-2 }}>Imadeyouawebsite</div>
            </div>
          </div>
          <button onClick={onStart}
            style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700, fontSize:13, background:"#6366f1", color:"#fff", border:"none", padding:"10px 24px", borderRadius:8, cursor:"pointer", boxShadow:"0 0 20px rgba(99,102,241,0.4)", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="#4f46e5"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#6366f1"; e.currentTarget.style.transform="translateY(0)"; }}>
            Open Builder →
          </button>
        </nav>

        {/* Hero */}
        <section style={{ padding:"120px 64px 100px", textAlign:"center", maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:100, padding:"6px 18px", marginBottom:32, fontSize:12.5, color:"#818cf8", fontWeight:600, letterSpacing:0.5 }}>
            ⚡ EVERY HTML ELEMENT. TOTAL CONTROL.
          </div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(2.8rem, 6vw, 5rem)", fontWeight:800, lineHeight:1.05, color:"#f8fafc", marginBottom:24, letterSpacing:-1.5 }}>
            Build any website.<br />
            <span style={{ background:"linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              No limits. Ever.
            </span>
          </h1>
          <p style={{ fontSize:"1.2rem", color:"rgba(255,255,255,0.55)", lineHeight:1.75, marginBottom:52, maxWidth:600, margin:"0 auto 52px" }}>
            A drag-and-drop website builder with every HTML element, full CSS control, custom right-click menus, and clean export. Built for people who know what they want.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", alignItems:"center", flexWrap:"wrap" }}>
            <button onClick={onStart}
              style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:"1.05rem", background:"linear-gradient(135deg, #6366f1, #8b5cf6)", color:"#fff", border:"none", padding:"18px 44px", borderRadius:12, cursor:"pointer", boxShadow:"0 8px 40px rgba(99,102,241,0.45)", transition:"all 0.2s", letterSpacing:"-0.01em" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow="0 16px 50px rgba(99,102,241,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 40px rgba(99,102,241,0.45)"; }}>
              Start Building Free →
            </button>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", letterSpacing:0.3 }}>No account. No signup. Just build.</div>
          </div>
        </section>

        {/* Feature Cards */}
        <section style={{ padding:"0 64px 120px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {features.map((f,i) => (
              <div key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ background: hovered===i ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", border:`1px solid ${hovered===i ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)"}`, borderRadius:16, padding:"32px 28px", cursor:"default", transition:"all 0.2s", transform: hovered===i ? "translateY(-4px)" : "none" }}>
                <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"1.05rem", color:"#f8fafc", marginBottom:10 }}>{f.title}</div>
                <div style={{ fontSize:"0.9rem", color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"80px 64px", textAlign:"center" }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"2rem", fontWeight:800, color:"#f8fafc", marginBottom:16 }}>Ready to build?</div>
          <div style={{ color:"rgba(255,255,255,0.4)", marginBottom:40, fontSize:"1rem" }}>Your canvas is waiting. Everything is free. Go nuts.</div>
          <button onClick={onStart}
            style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700, fontSize:"1rem", background:"#6366f1", color:"#fff", border:"none", padding:"16px 40px", borderRadius:10, cursor:"pointer", boxShadow:"0 8px 30px rgba(99,102,241,0.4)", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="#4f46e5"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#6366f1"; e.currentTarget.style.transform="none"; }}>
            Open Builder ⚡
          </button>
          <div style={{ marginTop:56, fontSize:11, color:"rgba(255,255,255,0.15)", fontFamily:"'Fira Code', monospace", letterSpacing:1 }}>
            JeezMumImadeyouawebsite © 2025
          </div>
        </section>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   RIGHT-CLICK CONTEXT MENU
════════════════════════════════════════ */
function ContextMenu({ x, y, target, onAction, t }) {
  const items = [
    { action:"duplicate",    label:"⧉  Duplicate",      shortcut:"⌘D" },
    { action:"lock",         label: target?.locked ? "🔓  Unlock" : "🔒  Lock",  shortcut:"" },
    { divider: true },
    { action:"bringFront",   label:"⬆  Bring to Front", shortcut:"" },
    { action:"sendBack",     label:"⬇  Send to Back",   shortcut:"" },
    { action:"bringForward", label:"↑  Bring Forward",  shortcut:"" },
    { action:"sendBackward", label:"↓  Send Backward",  shortcut:"" },
    { divider: true },
    { action:"copyStyle",    label:"✦  Copy Styles",    shortcut:"" },
    { action:"pasteStyle",   label:"✧  Paste Styles",   shortcut:"" },
    { divider: true },
    { action:"selectAll",    label:"⊞  Select All",     shortcut:"⌘A" },
    { action:"deselect",     label:"○  Deselect",       shortcut:"Esc" },
    { divider: true },
    { action:"delete",       label:"✕  Delete",         shortcut:"Del", danger: true },
  ];

  return (
    <div style={{ position:"fixed", left:x, top:y, zIndex:9999, background:t.menuBg, border:`1px solid ${t.border}`, borderRadius:10, boxShadow:`0 12px 40px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.3)`, padding:"6px 0", minWidth:210, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      {target && <div style={{ padding:"6px 14px 8px", fontSize:10, color:t.textSub, fontFamily:"'Fira Code', monospace", borderBottom:`1px solid ${t.border}`, marginBottom:4 }}>&lt;{target.tag}&gt; — {target.id.slice(0,12)}</div>}
      {items.map((item, i) => item.divider
        ? <div key={i} style={{ height:1, background:t.border, margin:"4px 0" }} />
        : (
          <div key={i} onClick={() => onAction(item.action)}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 14px", cursor:"pointer", color: item.danger ? "#f87171" : t.text, fontSize:12.5, transition:"background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = item.danger ? "rgba(248,113,113,0.1)" : t.cardHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span>{item.label}</span>
            {item.shortcut && <span style={{ fontSize:10, color:t.textSub, fontFamily:"'Fira Code', monospace" }}>{item.shortcut}</span>}
          </div>
        )
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   PROPERTY PANEL
════════════════════════════════════════ */
function PropPanel({ el, onUpdateStyle, onUpdateEl, onUpdateAttr, onUpdateContent, t }) {
  const [tab, setTab] = useState("style");

  if (!el) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:12 }}>
      <div style={{ fontSize:40, opacity:0.08 }}>✦</div>
      <div style={{ fontSize:12, color:t.textSub, fontFamily:"'Fira Code', monospace", textAlign:"center", lineHeight:1.8 }}>Select an element<br />to edit properties</div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Fira Code', monospace", fontSize:12, color:t.accent, fontWeight:600 }}>&lt;{el.tag}&gt;</div>
          <div style={{ fontSize:9, color:t.textSub, fontFamily:"'Fira Code', monospace" }}>{el.id.slice(0,14)}</div>
        </div>
        <div style={{ display:"flex", gap:4, marginTop:8 }}>
          {[["style","Style"],["attrs","Attrs"],["content","Content"],["layout","Layout"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:"5px 0", border:"none", borderRadius:5, cursor:"pointer", fontSize:10, fontWeight:600, fontFamily:"'Plus Jakarta Sans', sans-serif", background: tab===k ? t.accent : t.card, color: tab===k ? "#fff" : t.textSub, transition:"all 0.15s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflow:"auto", padding:12 }}>
        {tab === "style" && (
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {/* Position & Size */}
            <div style={{ background:t.card, borderRadius:8, padding:10, border:`1px solid ${t.border}`, marginBottom:6 }}>
              <div style={secHead(t)}>Position & Size</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                {[["x","X",Math.round(el.x)],["y","Y",Math.round(el.y)],["w","W",Math.round(el.w)],["h","H",Math.round(el.h)]].map(([k,lbl,val]) => (
                  <div key={k}>
                    <div style={microLabel(t)}>{lbl}</div>
                    <input type="number" value={val} onChange={e => onUpdateEl({ [k]: parseFloat(e.target.value)||0 })} style={numInp(t)} />
                  </div>
                ))}
              </div>
            </div>
            {/* Style fields */}
            {STYLE_FIELDS.map((f, i) => {
              if (f.section) return (
                <div key={i} style={{ marginTop:6 }}>
                  <div style={secHead(t)}>{f.section}</div>
                </div>
              );
              return (
                <div key={f.key} style={{ display:"flex", alignItems:"center", gap:6, minHeight:26 }}>
                  <span style={{ fontSize:10, color:t.textSub, width:90, flexShrink:0, fontFamily:"'Fira Code', monospace", lineHeight:1.2 }}>{f.label}</span>
                  {f.type === "color" ? (
                    <div style={{ display:"flex", gap:4, flex:1 }}>
                      <input type="color" value={el.styles[f.key] || "#000000"} onChange={e => onUpdateStyle(f.key, e.target.value)} style={{ width:26, height:22, border:"none", borderRadius:3, cursor:"pointer", background:"none", padding:0 }} />
                      <input type="text" value={el.styles[f.key] || ""} onChange={e => onUpdateStyle(f.key, e.target.value)} style={txtInp(t)} placeholder="none" />
                    </div>
                  ) : f.type === "sel" ? (
                    <select value={el.styles[f.key] || ""} onChange={e => onUpdateStyle(f.key, e.target.value)} style={{ ...txtInp(t), flex:1, cursor:"pointer" }}>
                      <option value="">—</option>
                      {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={el.styles[f.key] || ""} onChange={e => onUpdateStyle(f.key, e.target.value)} style={{ ...txtInp(t), flex:1 }} placeholder={f.ph||"—"} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "attrs" && (
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={secHead(t)}>HTML Attributes</div>
            {["src","href","alt","target","type","placeholder","value","name","id","class","controls","autoplay","loop","muted","width","height","rel","download","disabled","required","readonly","checked","selected","min","max","step","rows","cols","colspan","rowspan","action","method","for","accept","multiple","pattern","title","tabindex","aria-label","aria-describedby","role","data-id","data-value","viewBox","fill","stroke","points","cx","cy","r","rx","ry","d","xmlns","dateTime"].map(attr => (
              <div key={attr} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10, color:t.textSub, width:90, flexShrink:0, fontFamily:"'Fira Code', monospace" }}>{attr}</span>
                <input type="text" value={el.attrs?.[attr] !== undefined ? String(el.attrs[attr]) : ""} onChange={e => onUpdateAttr(attr, e.target.value)} style={{ ...txtInp(t), flex:1 }} placeholder="—" />
              </div>
            ))}
            <div style={{ marginTop:8 }}>
              <div style={secHead(t)}>Custom Attribute</div>
              <CustomAttr onAdd={(k,v) => onUpdateAttr(k,v)} t={t} />
            </div>
          </div>
        )}

        {tab === "content" && (
          <div>
            <div style={secHead(t)}>{el.isEmbed ? "Embed / Raw Code" : "innerHTML / Content"}</div>
            <textarea value={el.content} onChange={e => onUpdateContent(e.target.value)}
              style={{ width:"100%", height:280, background:t.inputBg, border:`1px solid ${t.border}`, color: el.isEmbed ? "#a78bfa" : t.text, padding:10, borderRadius:8, fontSize:11, fontFamily:"'Fira Code', monospace", resize:"vertical", lineHeight:1.7, outline:"none", boxSizing:"border-box" }}
            />
            {el.isEmbed && <div style={{ fontSize:9.5, color:t.textSub, marginTop:6, lineHeight:1.5 }}>Supports raw HTML, &lt;style&gt;, &lt;script&gt; tags. Executes in preview.</div>}
          </div>
        )}

        {tab === "layout" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={secHead(t)}>Element Layer</div>
            <div style={{ display:"flex", gap:5 }}>
              <input type="number" value={el.zIndex || 1} onChange={e => onUpdateStyle("zIndex", e.target.value)} style={{ ...numInp(t), flex:1 }} placeholder="z-index" />
              <span style={{ fontSize:10, color:t.textSub, alignSelf:"center", fontFamily:"'Fira Code', monospace" }}>z-index</span>
            </div>
            <div style={secHead(t)}>Visibility</div>
            <div style={{ display:"flex", gap:6 }}>
              {[["visible","Visible"],["hidden","Hidden"],["collapse","Collapse"]].map(([v,l]) => (
                <button key={v} onClick={() => onUpdateStyle("visibility", v)} style={{ flex:1, padding:"6px", border:`1px solid ${el.styles.visibility===v ? t.accent : t.border}`, borderRadius:6, background: el.styles.visibility===v ? t.accent : t.card, color: el.styles.visibility===v ? "#fff" : t.text, fontSize:10, cursor:"pointer", fontFamily:"'Plus Jakarta Sans', sans-serif" }}>{l}</button>
              ))}
            </div>
            <div style={secHead(t)}>Lock</div>
            <div style={{ fontSize:11, color:t.textSub }}>Lock prevents dragging & resizing. Right-click → Unlock to restore.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomAttr({ onAdd, t }) {
  const [k, setK] = useState(""); const [v, setV] = useState("");
  return (
    <div style={{ display:"flex", gap:5 }}>
      <input type="text" placeholder="key" value={k} onChange={e => setK(e.target.value)} style={{ ...txtInp(t), width:"36%" }} />
      <input type="text" placeholder="value" value={v} onChange={e => setV(e.target.value)} style={{ ...txtInp(t), flex:1 }} />
      <button onClick={() => { if(k.trim()){ onAdd(k.trim(),v); setK(""); setV(""); } }} style={{ background:t.accent, border:"none", color:"#fff", padding:"0 10px", borderRadius:6, cursor:"pointer", fontSize:13, fontWeight:"bold" }}>+</button>
    </div>
  );
}

const secHead = t => ({ fontSize:9, color:t.accent, fontFamily:"'Fira Code', monospace", textTransform:"uppercase", letterSpacing:1.5, fontWeight:700, marginBottom:8, marginTop:4 });
const microLabel = t => ({ fontSize:9, color:t.textSub, fontFamily:"'Fira Code', monospace", marginBottom:3 });
const numInp = t => ({ background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, padding:"4px 8px", borderRadius:5, fontSize:11, fontFamily:"'Fira Code', monospace", width:"100%", outline:"none", boxSizing:"border-box" });
const txtInp = t => ({ background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, padding:"3px 8px", borderRadius:5, fontSize:11, fontFamily:"'Fira Code', monospace", outline:"none", boxSizing:"border-box", width:"100%" });

/* ════════════════════════════════════════
   MAIN BUILDER
════════════════════════════════════════ */
function Builder({ onHome, dark, setDark }) {
  const t = dark ? DARK : LIGHT;
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState({ "✦ Typography": true, "⊞ Layout": true });
  const [contextMenu, setContextMenu] = useState(null);
  const [copiedStyle, setCopiedStyle] = useState(null);
  const [toast, setToast] = useState("");
  const [canvasTheme, setCanvasTheme] = useState("dark");

  const dragTag = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const selected = elements.find(e => e.id === selectedId) || null;
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  /* ─ Mutations ─ */
  const upEl   = useCallback((id, ch) => setElements(p => p.map(e => e.id===id ? {...e,...ch} : e)), []);
  const upStyle= useCallback((id, k, v) => setElements(p => p.map(e => e.id===id ? {...e, styles:{...e.styles,[k]:v}} : e)), []);
  const upAttr = useCallback((id, k, v) => setElements(p => p.map(e => e.id===id ? {...e, attrs:{...e.attrs,[k]:v}} : e)), []);
  const upCont = useCallback((id, v) => setElements(p => p.map(e => e.id===id ? {...e, content:v} : e)), []);
  const delEl  = useCallback((id) => { setElements(p => p.filter(e => e.id!==id)); if(selectedId===id) setSelectedId(null); }, [selectedId]);
  const dupEl  = useCallback((id) => {
    const e = elements.find(x => x.id===id); if(!e) return;
    const ne = {...e, id:uid(), x:e.x+24, y:e.y+24};
    setElements(p => [...p, ne]); setSelectedId(ne.id);
  }, [elements]);

  /* ─ Canvas Drop ─ */
  const handleDrop = useCallback((ev) => {
    ev.preventDefault();
    const tag = dragTag.current; if(!tag) return; dragTag.current = null;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, (ev.clientX - rect.left) / zoom);
    const y = Math.max(0, (ev.clientY - rect.top) / zoom);
    const ne = createElement(tag, Math.round(x - 60), Math.round(y - 24));
    setElements(p => [...p, ne]); setSelectedId(ne.id);
  }, [zoom]);

  /* ─ Element Drag ─ */
  const handleElMouseDown = useCallback((ev, id) => {
    if (preview) return;
    const el = elements.find(e => e.id===id);
    if (!el || el.locked) return;
    ev.stopPropagation();
    setSelectedId(id);
    const sx=ev.clientX, sy=ev.clientY, ox=el.x, oy=el.y;
    const move = me => upEl(id, { x: Math.max(0, ox+(me.clientX-sx)/zoom), y: Math.max(0, oy+(me.clientY-sy)/zoom) });
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  }, [elements, zoom, preview, upEl]);

  /* ─ Resize ─ */
  const handleResize = useCallback((ev, id) => {
    ev.stopPropagation();
    const el = elements.find(e => e.id===id); if(!el) return;
    const sx=ev.clientX, sy=ev.clientY, ow=el.w, oh=el.h;
    const move = me => upEl(id, { w: Math.max(32, ow+(me.clientX-sx)/zoom), h: Math.max(16, oh+(me.clientY-sy)/zoom) });
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  }, [elements, zoom, upEl]);

  /* ─ Right-click ─ */
  const handleContextMenu = useCallback((ev, id) => {
    if (preview) return;
    ev.preventDefault();
    if (id) setSelectedId(id);
    setContextMenu({ x: ev.clientX, y: ev.clientY, id: id || selectedId });
  }, [preview, selectedId]);

  const handleContextAction = useCallback((action) => {
    const id = contextMenu?.id;
    setContextMenu(null);
    if (!id && !["selectAll","deselect"].includes(action)) return;
    switch(action) {
      case "duplicate":   dupEl(id); break;
      case "delete":      delEl(id); break;
      case "lock":        setElements(p => p.map(e => e.id===id ? {...e, locked:!e.locked} : e)); break;
      case "bringFront":  setElements(p => { const max = Math.max(...p.map(e=>e.zIndex||1)); return p.map(e => e.id===id ? {...e, zIndex:max+1} : e); }); break;
      case "sendBack":    setElements(p => { const min = Math.min(...p.map(e=>e.zIndex||1)); return p.map(e => e.id===id ? {...e, zIndex:Math.max(0,min-1)} : e); }); break;
      case "bringForward":setElements(p => p.map(e => e.id===id ? {...e, zIndex:(e.zIndex||1)+1} : e)); break;
      case "sendBackward":setElements(p => p.map(e => e.id===id ? {...e, zIndex:Math.max(0,(e.zIndex||1)-1)} : e)); break;
      case "copyStyle":   const src = elements.find(e=>e.id===id); if(src) { setCopiedStyle({...src.styles}); showToast("✓ Styles copied!"); } break;
      case "pasteStyle":  if(copiedStyle) { setElements(p => p.map(e => e.id===id ? {...e, styles:{...e.styles,...copiedStyle}} : e)); showToast("✓ Styles pasted!"); } break;
      case "selectAll":   break;
      case "deselect":    setSelectedId(null); break;
    }
  }, [contextMenu, dupEl, delEl, elements, copiedStyle]);

  /* ─ Keyboard ─ */
  useEffect(() => {
    const h = (e) => {
      const tg = document.activeElement?.tagName;
      if (["INPUT","TEXTAREA","SELECT"].includes(tg)) return;
      if ((e.key==="Delete"||e.key==="Backspace") && selectedId) delEl(selectedId);
      if ((e.key==="d"||e.key==="D") && (e.metaKey||e.ctrlKey) && selectedId) { e.preventDefault(); dupEl(selectedId); }
      if (e.key==="Escape") { setSelectedId(null); setContextMenu(null); }
      if ((e.key==="a"||e.key==="A") && (e.metaKey||e.ctrlKey)) { e.preventDefault(); }
    };
    window.addEventListener("keydown",h);
    return () => window.removeEventListener("keydown",h);
  }, [selectedId, delEl, dupEl]);

  /* ─ Close context on click ─ */
  useEffect(() => {
    const h = () => setContextMenu(null);
    if (contextMenu) { setTimeout(() => window.addEventListener("click",h), 10); }
    return () => window.removeEventListener("click",h);
  }, [contextMenu]);

  /* ─ Export ─ */
  const exportZip = useCallback(async () => {
    try {
      const JSZip = await loadZip();
      const zip = new JSZip();
      const styleStr = (s) => Object.entries(s).map(([k,v]) => `${k.replace(/([A-Z])/g,"-$1").toLowerCase()}:${v}`).join(";");
      const html = elements.map(el => {
        const pos = { position:"absolute", left:el.x+"px", top:el.y+"px", width:el.w+"px", minHeight:el.h+"px", zIndex:el.zIndex||1 };
        const style = styleStr({...pos,...el.styles});
        const attrs = Object.entries(el.attrs||{}).filter(([,v])=>v!==""&&v!==false).map(([k,v])=>v===true||v==="true"?k:`${k}="${v}"`).join(" ");
        if (el.isEmbed) return `  <!-- Embed -->\n  ${el.content}`;
        const voids = ["input","img","hr","br","area","base","col","embed","link","meta","param","source","track","wbr"];
        if (voids.includes(el.tag)) return `  <${el.tag} style="${style}" ${attrs} />`;
        return `  <${el.tag} style="${style}" ${attrs}>${el.content}</${el.tag}>`;
      }).join("\n");
      const canvasBg = canvasTheme==="dark" ? "#0a0a14" : canvasTheme==="light" ? "#ffffff" : "#f8f9ff";
      zip.file("index.html", `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1.0">\n  <title>My Site</title>\n  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:${canvasBg};font-family:'Plus Jakarta Sans',system-ui,sans-serif}.canvas{position:relative;width:1280px;min-height:960px}</style>\n</head>\n<body>\n<div class="canvas">\n${html}\n</div>\n</body>\n</html>`);
      zip.file("site.json", JSON.stringify({ elements, canvasTheme }, null, 2));
      const blob = await zip.generateAsync({ type:"blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download="jeez-mum-site.zip"; a.click();
      URL.revokeObjectURL(url);
      showToast("✓ Exported!");
    } catch(e){ showToast("Export failed"); }
  }, [elements, canvasTheme]);

  const importJSON = useCallback(async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.elements) { setElements(data.elements); showToast(`✓ Imported ${data.elements.length} elements!`); }
      if (data.canvasTheme) setCanvasTheme(data.canvasTheme);
    } catch { showToast("Import failed — use exported site.json"); }
  }, []);

  const canvasBgColor = canvasTheme==="dark" ? "#0a0a14" : canvasTheme==="light" ? "#ffffff" : "#f0f0fa";
  const canvasDotColor = canvasTheme==="dark" ? "rgba(60,60,120,0.25)" : "rgba(99,102,241,0.12)";

  /* ─ Filtered catalog ─ */
  const filtered = search.trim()
    ? Object.fromEntries(Object.entries(CATALOG).map(([cat, items]) => [cat, items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()) || i.tag.toLowerCase().includes(search.toLowerCase()))]).filter(([,i])=>i.length>0))
    : CATALOG;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:t.bg, color:t.text, fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif", overflow:"hidden" }}>

      {/* ─── Toolbar ─── */}
      <div style={{ background:t.toolbarBg, borderBottom:`1px solid ${t.border}`, height:52, display:"flex", alignItems:"center", padding:"0 14px", gap:8, flexShrink:0, boxShadow:dark?"0 1px 20px rgba(0,0,0,0.4)":"0 1px 8px rgba(0,0,0,0.06)" }}>
        <button onClick={onHome} style={{ background:"none", border:`1px solid ${t.border}`, color:t.textSub, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }}
          onMouseEnter={e=>{e.currentTarget.style.color=t.text}} onMouseLeave={e=>{e.currentTarget.style.color=t.textSub}}>
          ← Home
        </button>

        <div style={{ display:"flex", flexDirection:"column", marginLeft:4, marginRight:6 }}>
          <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:13, color:t.accent, letterSpacing:-0.5 }}>⚡ JeezMum</span>
          <span style={{ fontSize:7.5, color:t.textSub, letterSpacing:1.2, textTransform:"uppercase", marginTop:-2 }}>Imadeyouawebsite</span>
        </div>

        <div style={{ width:1, height:28, background:t.border }} />

        {/* Canvas theme */}
        <div style={{ display:"flex", gap:3, background:t.card, borderRadius:7, padding:"3px", border:`1px solid ${t.border}` }}>
          {[["dark","🌑"],["light","☀"],["tinted","🌃"]].map(([v,icon]) => (
            <button key={v} onClick={() => setCanvasTheme(v)} style={{ background:canvasTheme===v?t.accent:"transparent", border:"none", color:canvasTheme===v?"#fff":t.textSub, padding:"4px 9px", borderRadius:5, cursor:"pointer", fontSize:11, transition:"all 0.15s" }} title={`Canvas: ${v}`}>{icon}</button>
          ))}
        </div>

        {toast && <span style={{ fontSize:11, color:"#4ade80", fontFamily:"'Fira Code', monospace", marginLeft:4 }}>{toast}</span>}

        <div style={{ marginLeft:"auto", display:"flex", gap:6, alignItems:"center" }}>
          {/* UI theme toggle */}
          <button onClick={() => setDark(d=>!d)} style={{ background:t.card, border:`1px solid ${t.border}`, color:t.text, padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
            {dark ? "☀ Light" : "🌑 Dark"}
          </button>

          {/* Zoom */}
          <input type="range" min="0.25" max="1.5" step="0.05" value={zoom} onChange={e=>setZoom(parseFloat(e.target.value))} style={{ width:72, accentColor:t.accent, cursor:"pointer" }} />
          <span style={{ fontSize:10, color:t.textSub, width:32, fontFamily:"'Fira Code', monospace" }}>{Math.round(zoom*100)}%</span>

          <div style={{ width:1, height:24, background:t.border }} />

          <button onClick={()=>fileRef.current?.click()} style={toolbarBtn(t)}>⬆ Import</button>
          <input ref={fileRef} type="file" accept=".json" style={{ display:"none" }} onChange={e=>e.target.files[0]&&importJSON(e.target.files[0])} />
          <button onClick={exportZip} style={{ ...toolbarBtn(t), color:t.accent }}>⬇ Export ZIP</button>

          <div style={{ width:1, height:24, background:t.border }} />

          <button onClick={()=>setPreview(false)} style={{ ...toolbarBtn(t), background:!preview?t.accent:"none", color:!preview?"#fff":t.textSub, borderColor:!preview?t.accent:t.border }}>✏ Edit</button>
          <button onClick={()=>{setPreview(true);setSelectedId(null);}} style={{ ...toolbarBtn(t), background:preview?t.accent:"none", color:preview?"#fff":t.textSub, borderColor:preview?t.accent:t.border }}>👁 Preview</button>

          <button onClick={()=>{if(window.confirm("Clear all elements?")) {setElements([]); setSelectedId(null);}}} style={{ ...toolbarBtn(t), borderColor:"#ef4444", color:"#ef4444" }}>✕ Clear</button>
        </div>
      </div>

      {/* ─── 3-column ─── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ─── Left: Element Catalog ─── */}
        {!preview && (
          <div style={{ width:218, background:t.sidebar, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"8px 10px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
              <input type="text" placeholder="Search elements…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...txtInp(t), width:"100%", padding:"7px 10px", fontSize:11.5 }} />
            </div>
            <div style={{ flex:1, overflow:"auto", padding:"6px" }}>
              <div style={{ fontSize:9, color:t.textSub, fontFamily:"'Fira Code', monospace", textAlign:"center", padding:"4px 0 8px", letterSpacing:1.2, textTransform:"uppercase" }}>drag to canvas</div>
              {Object.entries(filtered).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom:4 }}>
                  <button onClick={()=>setOpenCats(s=>({...s,[cat]:!s[cat]}))}
                    style={{ width:"100%", background:"none", border:"none", color:openCats[cat]?t.accent:t.textSub, cursor:"pointer", padding:"5px 8px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:9.5, fontFamily:"'Fira Code', monospace", letterSpacing:0.5, textTransform:"uppercase" }}>
                    {cat} <span>{openCats[cat]?"▾":"▸"}</span>
                  </button>
                  {(openCats[cat] || search) && (
                    <div style={{ display:"flex", flexDirection:"column", gap:2, paddingLeft:2 }}>
                      {items.map(item => (
                        <div key={item.tag} draggable onDragStart={()=>{ dragTag.current = item.tag; }}
                          style={{ padding:"5px 9px", background:t.card, borderRadius:5, fontSize:11.5, cursor:"grab", border:`1px solid ${t.border}`, color:t.text, userSelect:"none", transition:"all 0.1s", fontWeight:500 }}
                          onMouseEnter={e=>{ e.currentTarget.style.background=t.cardHover; e.currentTarget.style.borderColor=t.accent; e.currentTarget.style.color=t.accent; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background=t.card; e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.text; }}
                        >{item.label}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Shortcuts footer */}
            <div style={{ padding:"8px 10px", borderTop:`1px solid ${t.border}`, flexShrink:0 }}>
              {[["Del","Delete el"],["⌘D","Duplicate"],["Esc","Deselect"],["RMB","Menu"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:t.textSub, fontFamily:"'Fira Code', monospace", marginBottom:2 }}>
                  <span style={{ color:dark?"#3a3a6a":"#c7d2fe" }}>{k}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ fontSize:9, color:t.textSub, marginTop:4, fontFamily:"'Fira Code', monospace" }}>{elements.length} element{elements.length!==1?"s":""}</div>
            </div>
          </div>
        )}

        {/* ─── Canvas ─── */}
        <div style={{ flex:1, overflow:"auto", background: preview ? canvasBgColor : (dark?"#060610":"#e8e8f8"), backgroundImage: preview ? "none" : `radial-gradient(${canvasDotColor} 1px, transparent 1px)`, backgroundSize:"24px 24px", display:"flex", justifyContent:"flex-start", alignItems:"flex-start", padding: preview ? 0 : 32 }}
          onContextMenu={e=>handleContextMenu(e, null)}
          onClick={()=>{ setSelectedId(null); }}
          onDragOver={e=>{e.preventDefault(); e.dataTransfer.dropEffect="copy";}}
          onDrop={handleDrop}
        >
          <div style={{ position:"relative", flexShrink:0 }}>
            {/* Canvas frame */}
            {!preview && <div style={{ position:"absolute", top:-24, left:0, fontSize:9, color:t.textSub, fontFamily:"'Fira Code', monospace", letterSpacing:1, whiteSpace:"nowrap" }}>1280 × 960 px</div>}
            <div ref={canvasRef} style={{ width:1280*zoom, height:Math.max(960*zoom, window.innerHeight-100), background:canvasBgColor, position:"relative", overflow:"hidden", boxShadow: preview?"none":`0 0 60px rgba(0,0,0,0.2), 0 0 2px ${t.accent}22`, border: preview?"none":`1px solid ${t.border}`, borderRadius: preview?0:6 }}>
              <div style={{ transform:`scale(${zoom})`, transformOrigin:"top left", width:1280, minHeight:960, position:"relative" }}>
                {elements.map(el => <CanvasEl key={el.id} el={el} selectedId={selectedId} preview={preview} t={t}
                  onMouseDown={handleElMouseDown} onResize={handleResize} onContextMenu={handleContextMenu} onClickEl={id=>setSelectedId(id)} />)}
                {elements.length===0 && !preview && (
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
                    <div style={{ fontSize:64, opacity:0.06, marginBottom:16 }}>⚡</div>
                    <div style={{ fontSize:17, fontWeight:600, color:canvasTheme==="dark"?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.15)", fontFamily:"'Syne', sans-serif" }}>Drag elements here</div>
                    <div style={{ fontSize:11, color:canvasTheme==="dark"?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.1)", marginTop:6, fontFamily:"'Fira Code', monospace" }}>from the left panel</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right: Properties ─── */}
        {!preview && (
          <div style={{ width:266, background:t.sidebar, borderLeft:`1px solid ${t.border}`, flexShrink:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <PropPanel el={selected} t={t}
              onUpdateStyle={(k,v) => selected && upStyle(selected.id,k,v)}
              onUpdateEl={ch => selected && upEl(selected.id,ch)}
              onUpdateAttr={(k,v) => selected && upAttr(selected.id,k,v)}
              onUpdateContent={v => selected && upCont(selected.id,v)}
            />
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} target={elements.find(e=>e.id===contextMenu.id)} onAction={handleContextAction} t={t} />
      )}
    </div>
  );
}

/* ─── Canvas Element ─── */
function CanvasEl({ el, selectedId, preview, t, onMouseDown, onResize, onContextMenu, onClickEl }) {
  const isSel = el.id === selectedId;
  const isEmbed = el.isEmbed;

  const outerStyle = {
    position:"absolute", left:el.x, top:el.y, width:el.w, minHeight:el.h,
    zIndex: el.zIndex || 1,
    outline: isSel && !preview ? `2px solid ${t.accent}` : preview ? "none" : "1px dashed rgba(120,120,200,0.25)",
    outlineOffset: isSel && !preview ? 1 : 0,
    cursor: preview ? "default" : el.locked ? "not-allowed" : "move",
    userSelect:"none", boxSizing:"border-box",
  };

  const voids = ["input","img","hr","br","area","base","col","embed","link","meta","param","source","track","wbr"];
  const Tag = isEmbed ? "div" : el.tag;
  const innerStyle = { ...el.styles, width:"100%", minHeight:el.h, boxSizing:"border-box" };

  const getContent = () => {
    if (isEmbed) {
      return preview
        ? <div dangerouslySetInnerHTML={{ __html: el.content }} />
        : <div style={{ fontFamily:"'Fira Code', monospace", fontSize:11, color:"#a78bfa", padding:10, background:"rgba(99,102,241,0.08)", border:"2px dashed rgba(99,102,241,0.3)", borderRadius:6, whiteSpace:"pre-wrap", userSelect:"none" }}>
            ⟨/⟩ {el.rawTag?.replace("__","").replace("__","")}<br/>{el.content.slice(0,60)}{el.content.length>60?"…":""}
          </div>;
    }
    if (el.tag === "img") return <Tag style={innerStyle} src={el.attrs?.src||""} alt={el.attrs?.alt||""} draggable={false} />;
    if (el.tag === "iframe") return <Tag style={innerStyle} src={el.attrs?.src} title={el.attrs?.title||"embed"} />;
    if (el.tag === "input") return <Tag style={innerStyle} {...el.attrs} readOnly={!preview} />;
    if (el.tag === "canvas") return <Tag style={innerStyle} {...el.attrs} />;
    if (voids.includes(el.tag)) return <Tag style={innerStyle} {...el.attrs} />;
    if (el.tag === "select") return <Tag style={innerStyle} dangerouslySetInnerHTML={{ __html: el.content }} />;
    return <Tag style={innerStyle} {...el.attrs} dangerouslySetInnerHTML={{ __html: el.content }} />;
  };

  return (
    <div style={outerStyle}
      onMouseDown={ev => { ev.stopPropagation(); onMouseDown(ev, el.id); onClickEl(el.id); }}
      onClick={ev => { ev.stopPropagation(); onClickEl(el.id); }}
      onContextMenu={ev => { ev.stopPropagation(); onContextMenu(ev, el.id); }}
    >
      {isSel && !preview && (
        <div style={{ position:"absolute", top:-26, left:-1, zIndex:200, display:"flex", alignItems:"center", gap:1, background:t.accent, borderRadius:"5px 5px 0 0", padding:"2px 8px", userSelect:"none" }}>
          <span style={{ fontFamily:"'Fira Code', monospace", color:"#fff", fontSize:10 }}>&lt;{el.tag}&gt;{el.locked?" 🔒":""}</span>
        </div>
      )}
      {getContent()}
      {isSel && !preview && !el.locked && (
        <div onMouseDown={ev => { ev.stopPropagation(); onResize(ev, el.id); }}
          style={{ position:"absolute", right:-5, bottom:-5, width:14, height:14, background:t.accent, cursor:"se-resize", borderRadius:3, border:"2px solid #fff", zIndex:201 }} />
      )}
    </div>
  );
}

const toolbarBtn = t => ({ background:"none", border:`1px solid ${t.border}`, color:t.textSub, padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11.5, fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:500, transition:"all 0.12s", display:"flex", alignItems:"center", gap:4 });

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(true);

  useEffect(() => { injectFonts(); }, []);

  if (page === "home") return <HomePage onStart={() => setPage("builder")} />;
  return <Builder onHome={() => setPage("home")} dark={dark} setDark={setDark} />;
}
