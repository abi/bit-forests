import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class LogisticRegressionClassifier {
	private static int[][] xData;
	private static int[] yData;
	private static float[] beta;
	
	private static final String DATASET_NAME = "heart";
	private static final int EPOCHS = 10000;
	private static final float LEARNING_RATE = (float) 0.000081;
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
	    xData = new int[nVectors][x_n];
	    yData = new int[nVectors];
	    int i = 0;
	    while((line = rd.readLine()) != null){
	    	String[] a = line.split(":");
	    	
	    	yData[i] = Integer.parseInt(a[1].trim());
			
	    	String[] xVals = a[0].split(" ");
	    	for(int j = 0; j < xVals.length; j++){
	    		xData[i][j] = Integer.parseInt(xVals[j].trim());
	    	}
	    	i++;
	    }
	    
	    beta = new float[m];
	    
	    for(i = 0; i < EPOCHS; i++){
	    	float[] gradient = new float[m];
	    	for(int j = 0; j < nVectors; j++){
	    		int[] curX = xData[j];
	    		int curY = yData[j];
	    		int z = 0;
	    		for(int k = 0; k < m; k++){
	    			z += beta[k] * curX[k];
	    		}
	    		for(int k = 0; k < m; k++){
	    			gradient[k] += (float) curX[k] * ((float) curY - (1.0 / (1.0 + Math.exp(-1.0 * z))));
	    		}
	    	}
    		for(int k = 0; k < m; k++){
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
	    	
	    	int[] xVals = new int[x_n];
	    	String[] xValsStr = a[0].split(" ");
	    	for(int i = 0; i < xValsStr.length; i++){
	    		xVals[i] = Integer.parseInt(xValsStr[i].trim());
	    	}
	    	
	    	
	    	int z = 0;
    		for(int k = 0; k < m; k++){
    			z += beta[k] * xVals[k];
    		}
    		
	    	double yProb = (1.0 / (1.0 + Math.exp(-1.0 * z)));
	    	
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
	    
	    System.out.println("Percentage correct out of " + nVectors + " : " + ((float) nCorrect / nVectors) * 100 + " %");
		
	}
  public static void main(String[] args) throws IOException
  {

	train();
	test();
  }
}
