@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

@theme {
  --font-sans: "Cairo", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased;
    direction: rtl;
  }
}

/* تنسيقات الطباعة للفواتير */
@media print {
  @page { margin: 0; }
  body * { visibility: hidden; }
  #receipt-print, #receipt-print * { visibility: visible; }
  #receipt-print {
    position: absolute;
    left: 0; top: 0; width: 100%;
    padding: 20px;
  }
}
