const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async generatePDF(htmlContent, options = {}) {
    try {
      await this.initialize();
      
      const page = await this.browser.newPage();
      
      // Set the HTML content with professional styling
      const styledHTML = this.wrapWithStyling(htmlContent, options);
      await page.setContent(styledHTML, { waitUntil: 'networkidle0' });
      
      // Generate PDF with professional settings
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        displayHeaderFooter: false,
        ...options.pdfOptions
      });
      
      await page.close();
      return pdfBuffer;
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  }

  wrapWithStyling(htmlContent, options = {}) {
    const title = options.title || 'Course Content';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          font-size: 14px;
        }
        
        .content {
          max-width: 100%;
          margin: 0 auto;
        }
        
        .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
          color: #4285f4;
          margin-top: 25px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .content h1 { font-size: 24px; }
        .content h2 { font-size: 20px; }
        .content h3 { font-size: 18px; }
        .content h4 { font-size: 16px; }
        .content h5 { font-size: 14px; }
        .content h6 { font-size: 12px; }
        
        .content p {
          margin-bottom: 15px;
          text-align: justify;
        }
        
        .content ul, .content ol {
          margin-bottom: 15px;
          padding-left: 25px;
        }
        
        .content li {
          margin-bottom: 8px;
        }
        
        .content blockquote {
          border-left: 4px solid #4285f4;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #555;
          background: #f8f9fa;
          padding: 15px 20px;
          border-radius: 4px;
        }
        
        .content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .content table th,
        .content table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        .content table th {
          background-color: #4285f4;
          color: white;
          font-weight: 600;
        }
        
        .content img {
          max-width: 100%;
          height: auto;
          margin: 15px 0;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .content code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }
        
        .content pre {
          background: #f4f4f4;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
          margin: 15px 0;
        }
        
        .content pre code {
          background: none;
          padding: 0;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        ${htmlContent}
      </div>
    </body>
    </html>
    `;
  }

  getHeaderTemplate(title) {
    return `
      <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
        ${title}
      </div>
    `;
  }

  getFooterTemplate() {
    return `
      <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    `;
  }

  async savePDFToFile(pdfBuffer, filename) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, pdfBuffer);
    
    return filepath;
  }

  async generateAndSavePDF(htmlContent, options = {}) {
    try {
      // Generate PDF buffer
      const pdfBuffer = await this.generatePDF(htmlContent, options);
      
      // Create filename
      const timestamp = Date.now();
      const randomSuffix = Math.round(Math.random() * 1E9);
      const filename = `generated-pdf-${timestamp}-${randomSuffix}.pdf`;
      
      // Save to file
      const filepath = await this.savePDFToFile(pdfBuffer, filename);
      
      return {
        filename,
        filepath,
        url: `/uploads/${filename}`,
        size: pdfBuffer.length
      };
      
    } catch (error) {
      console.error('PDF generation and save error:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Create a singleton instance
const pdfGenerator = new PDFGenerator();

module.exports = pdfGenerator;
