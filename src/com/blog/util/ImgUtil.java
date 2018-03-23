package com.blog.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.CropImageFilter;
import java.awt.image.FilteredImageSource;
import java.io.File;
import java.io.IOException;

public class ImgUtil {
    public static void cutImg (String inPath, String outPath, int height, int width) {
        int afterWidth;
        int afterHeight;
        int beforeHeight;
        int beforeWidth;
        try {
            BufferedImage bi = ImageIO.read(new File(inPath));
            beforeHeight = bi.getHeight();
            beforeWidth = bi.getWidth();
            if((float)beforeHeight / beforeWidth > (float)height / width) {
                afterWidth = width;
                afterHeight = (int) (((float )width / (float)beforeWidth) * beforeHeight);
                int cutNarrowImgSize = (afterHeight - height)/2;

                BufferedImage narrowImg = new BufferedImage(afterWidth, afterHeight,BufferedImage.TYPE_INT_RGB);
                narrowImg.getGraphics().drawImage(bi.getScaledInstance(afterWidth, afterHeight, Image.SCALE_SMOOTH ), 0, 0, null);

                Image image = narrowImg.getScaledInstance(afterWidth, afterHeight, Image.SCALE_DEFAULT );
                CropImageFilter cropFilter = new CropImageFilter(0, cutNarrowImgSize, afterWidth, afterHeight - cutNarrowImgSize);
                Image img = Toolkit.getDefaultToolkit().createImage( new FilteredImageSource(image.getSource(), cropFilter));
                BufferedImage cutTopNarrowImg = new BufferedImage( afterWidth, afterHeight - cutNarrowImgSize,BufferedImage. TYPE_INT_RGB);
                cutTopNarrowImg.getGraphics().drawImage(img, 0, 0, null);

                image = cutTopNarrowImg.getScaledInstance(afterWidth, afterHeight-cutNarrowImgSize, Image. SCALE_DEFAULT);
                cropFilter = new CropImageFilter(0, 0, afterWidth, afterHeight-cutNarrowImgSize*2);
                img = Toolkit.getDefaultToolkit().createImage( new FilteredImageSource(image.getSource(), cropFilter));
                BufferedImage cutBottomNarrowImg = new BufferedImage( afterWidth, afterHeight - cutNarrowImgSize*2,BufferedImage. TYPE_INT_RGB);
                Graphics g = cutBottomNarrowImg.getGraphics();
                g.drawImage(img, 0, 0, null);
                g.dispose();
                ImageIO. write(cutBottomNarrowImg, "JPEG", new File(outPath));
            }
            else {
                afterWidth = (int) (((float )height / (float)beforeHeight) * beforeWidth);
                afterHeight = height;
                int mid = (afterWidth - width) / 2;
                BufferedImage narrowImg = new BufferedImage(afterWidth, afterHeight, BufferedImage.TYPE_INT_RGB);
                narrowImg.getGraphics().drawImage(bi.getScaledInstance(afterWidth, afterHeight, Image.SCALE_SMOOTH ), 0, 0, null);
                Image image_01 = narrowImg.getScaledInstance(afterWidth,afterWidth,Image.SCALE_DEFAULT);
                CropImageFilter cropImageFilter = new CropImageFilter(mid, 0, afterWidth - mid, afterHeight);
                Image image_02 = Toolkit.getDefaultToolkit().createImage(new FilteredImageSource(image_01.getSource(), cropImageFilter));
                BufferedImage leftCutImage = new BufferedImage(afterWidth - mid, afterHeight, BufferedImage.TYPE_INT_RGB);
                leftCutImage.getGraphics().drawImage(image_02, 0, 0, null);

                image_01 = leftCutImage.getScaledInstance(afterWidth - mid, afterHeight, Image.SCALE_DEFAULT);
                cropImageFilter = new CropImageFilter(0, 0, afterWidth - mid*2, afterHeight);
                image_02 = Toolkit.getDefaultToolkit().createImage( new FilteredImageSource(image_01.getSource(), cropImageFilter));
                BufferedImage cutRightNarrowImg = new BufferedImage( afterWidth - mid * 2, afterHeight,BufferedImage.TYPE_INT_RGB );
                Graphics g = cutRightNarrowImg.getGraphics();

                g.drawImage(image_02, 0, 0, null);
                g.dispose();

                ImageIO. write(cutRightNarrowImg, "JPEG", new File(outPath));
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        cutImg("D://test.jpg", "D://223.jpg", 320, 212);
    }
}
