import java.io.IOException;
import java.io.FileReader;
import java.io.BufferedReader;

public class NaiveBayesClassifier
{
	private static float[][][] xs;
	private static float[] ys;
	private static final String DATASET_NAME = "simple";
	private static boolean IS_LAPLACIAN = true;
	
	private static void train(boolean isLaplacian) throws IOException{
		BufferedReader rd = new BufferedReader(new FileReader("./cs109-datasets-mac/" + DATASET_NAME + "-train.txt"));
	    String line;
	    String xnStr = rd.readLine(); // num of input variables
	    String nVectorsStr = rd.readLine(); // num of input vectors (we don't care about this)
	    int x_n = Integer.parseInt(xnStr);
	    int nVectors = Integer.parseInt(nVectorsStr);
	    
	    xs = new float[x_n][2][2];
	    ys = new float[2];
	    
	    if(isLaplacian){
	    	for(int i = 0; i < x_n; i++){
	    		for(int j = 0; j < 2; j++){
	    			for(int k = 0; k < 2; k++){
	    				xs[i][j][k] = 1;
	    			}
	    		}
	    	}
	    }
	    
	    while((line = rd.readLine()) != null){
	    	String[] a = line.split(":");
	    	
	    	int y = Integer.parseInt(a[1].trim());
			ys[y]++;
			
	    	String[] xVals = a[0].split(" ");
	    	for(int i = 0; i < xVals.length; i++){
	    		int x = Integer.parseInt(xVals[i].trim());
	    		xs[i][x][y]++;
	    	}
	    }
	    
	    float total = ys[0] + ys[1];
	    
	    // Normalize xs
	    for(int i = 0; i < x_n; i++){
	    	for(int j = 0; j < 2; j++){
	    		for(int k = 0; k < 2; k++){
	    			xs[i][j][k] = xs[i][j][k] / total;
	    		}
	    	}
	    }
	    
	    // Normalize ys
	    ys[0] = ys[0] / total;
	    ys[1] = ys[1] / total;
	}
	
	private static void test() throws IOException{
		BufferedReader rd = new BufferedReader(new FileReader("./cs109-datasets-mac/" + DATASET_NAME + "-test.txt"));
	    String line;
	    
	    String xnStr = rd.readLine(); // num of input variables
	    String nVectorsStr = rd.readLine(); // num of input vectors (we don't care about this)
	    int x_n = Integer.parseInt(xnStr);
	    int nVectors = Integer.parseInt(nVectorsStr);
	    int nCorrect = 0;
	    
	    while((line = rd.readLine()) != null){
	    	String[] a = line.split(":");
	    	
	    	int[] xVals = new int[x_n];
	    	String[] xValsStr = a[0].split(" ");
	    	for(int i = 0; i < xValsStr.length; i++){
	    		xVals[i] = Integer.parseInt(xValsStr[i].trim());
	    	}
	    	
	    	float[] yProbs = new float[2];
	    	for(int yVal = 0; yVal < 2; yVal++){
	    		float p_y = ys[yVal];
	    		yProbs[yVal] = p_y;
	    		for(int i = 0; i < x_n; i++){
	    			yProbs[yVal] *= (xs[i][xVals[i]][yVal] / p_y);
	    		}
	    	}
	    	
	    	int predictedY = 0;
	    	if(yProbs[0] < yProbs[1]){
	    		predictedY = 1;
	    	}
	    	
	    	int y = Integer.parseInt(a[1].trim());
	    	
	    	if(predictedY == y){
	    		nCorrect++;
	    	}else{
	    		System.out.println("WRONG");
		    	System.out.println(predictedY);
		    	System.out.println(y);
	    	}
	    }
	    
	    System.out.println("Percentage correct out of " + nVectors + " : " + ((float) nCorrect / nVectors) * 100 + " %");
	}
	
  public static void main(String[] args) throws IOException
  {

	train(IS_LAPLACIAN);
	test();
  }
}