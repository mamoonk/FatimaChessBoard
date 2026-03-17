$code = @"
using System;
using System.Drawing;
using System.IO;

public class IconConverter {
    public static void ConvertToIco(string inputPath, string outputPath) {
        using (Bitmap bmp = new Bitmap(inputPath)) {
            IntPtr hIcon = bmp.GetHicon();
            using (Icon icon = Icon.FromHandle(hIcon)) {
                using (FileStream fs = new FileStream(outputPath, FileMode.Create)) {
                    icon.Save(fs);
                }
            }
            // Note: DestroyIcon should ideally be called to clean up hIcon, but this is a short script.
        }
    }
}
"@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[IconConverter]::ConvertToIco("$PWD\assets\icon.png", "$PWD\assets\icon.ico")
Write-Host "Icon converted."
