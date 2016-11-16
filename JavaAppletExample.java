import java.applet.Applet;
import java.awt.Graphics;

public class JavaAppletExample extends Applet {
  public void paint(Graphics g) {
    g.drawString("Hello World!", 200, 100);
  }
}