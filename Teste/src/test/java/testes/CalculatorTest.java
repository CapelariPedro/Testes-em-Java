package testes;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class CalculatorTest{
    @Test
    public void testAddition(){
        int result = 2 + 3;
        assertEquals(5, result, "2 + 3 should equal 5");
    }

    @Test
    public void testSubtraction(){
        int result = 5 - 3;
        assertEquals(2, result, "5 - 3 should equal 2");
    }

    @Test
    public void testMultiplication(){
        int result = 2 * 3;
        assertEquals(6, result, "2 * 3 should equal 6");
    }

    @Test
    public void testDivision(){
        int result = 6 / 3;
        assertEquals(2, result, "6 / 3 should equal 2");
    }

    @Test
    public void testDivisionByZero(){
        try {
            int result = 6 / 0;
        } catch (ArithmeticException e) {
            assertEquals("/ by zero", e.getMessage(), "Division by zero should throw an ArithmeticException");
        }
    }

    @Test
    public void testSquareRoot(){
        double result = Math.sqrt(16);
        assertEquals(4.0, result, "Square root of 16 should equal 4.0");
    }
    
}