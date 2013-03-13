import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class LogisticRegressionClassifier {
	private static int[][] xData;
	private static int[] yData;
	private static double[] beta;
	
	private static final String DATASET_NAME = "heart";
	private static final int EPOCHS = 10000;
	private static final double LEARNING_RATE = (double) 0.000088;
	private static boolean IS_LAPLACIAN = true;
	
	private static void train() throws IOException{
		BufferedReader rd = new BufferedReader(new FileReader("./cs109-datasets-mac/" + DATASET_NAME + "-train.txt"));
	    String line;
	    String xnStr = rd.readLine(); // num of input variables
	    String nVectorsStr = rd.readLine(); // num of input vectors (we don't care about this)
	    int x_n = Integer.parseInt(xnStr);
	    int m = x_n;
	    int nVectors = Integer.parseInt(nVectorsStr);
	    
	    // Read in all data
	    xData = new int[nVectors][x_n + 1];
	    yData = new int[nVectors];
	    int i = 0;
	    while((line = rd.readLine()) != null){
	    	String[] a = line.split(":");
	    	
	    	yData[i] = Integer.parseInt(a[1].trim());
			
	    	String[] xVals = a[0].split(" ");
	    	xData[i][0] = 1;
	    	for(int j = 1; j <= xVals.length; j++){
	    		xData[i][j] = Integer.parseInt(xVals[j - 1].trim());
	    	}
	    	i++;
	    }
	    
	    beta = new double[m + 1];
	    
	    for(i = 0; i < EPOCHS; i++){
	    	double[] gradient = new double[m + 1];
	    	for(int j = 0; j < nVectors; j++){
	    		int[] curX = xData[j];
	    		int curY = yData[j];
	    		int z = 0;
	    		for(int k = 0; k <= m; k++){
	    			z += beta[k] * curX[k];
	    		}
	    		for(int k = 0; k <= m; k++){
	    			gradient[k] += (double) curX[k] * ((double) curY - (1.0 / (1.0 + Math.exp(-1.0 * (double) z))));
	    		}
	    	}
    		for(int k = 0; k <= m; k++){
    			beta[k] += LEARNING_RATE * gradient[k];
    		}
	    }
	}

	private static void test() throws IOException{
		BufferedReader rd = new BufferedReader(new FileReader("./cs109-datasets-mac/" + DATASET_NAME + "-test.txt"));
	    String line;
	    
	    String xnStr = rd.readLine(); // num of input variables
	    String nVectorsStr = rd.readLine(); // num of input vectors (we don't care about this)
	    int x_n = Integer.parseInt(xnStr);
	    int m = x_n;
	    int nVectors = Integer.parseInt(nVectorsStr);
	    int nCorrect = 0;
	    
	    while((line = rd.readLine()) != null){
	    	String[] a = line.split(":");
	    	
	    	int[] xVals = new int[x_n + 1];
	    	xVals[0] = 1;
	    	String[] xValsStr = a[0].split(" ");
	    	for(int i = 0; i < xValsStr.length; i++){
	    		xVals[i + 1] = Integer.parseInt(xValsStr[i].trim());
	    	}
	    	
	    	
	    	int z = 0;
    		for(int k = 0; k <= m; k++){
    			z += beta[k] * xVals[k];
    		}
    		
	    	double yProb = (1.0 / (1.0 + Math.exp(-1.0 * (double) z)));
	    	
	    	int predictedY = 0;
	    	if(yProb > 0.5){
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
	    
	    System.out.println("Percentage correct out of " + nVectors + " : " + ((double) nCorrect / nVectors) * 100 + " %");
		
	}
  public static void main(String[] args) throws IOException
  {

	train();
	test();
  }
}
