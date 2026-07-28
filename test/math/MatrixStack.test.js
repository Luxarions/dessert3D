import { MatrixStack } from '../../src/math/MatrixStack.js';
import { Mat4 } from '../../src/math/Mat4.js';
import { assertEqual } from '../assert.js';

export const MatrixStackTests = {
  'push and pop matrix': () => {
    const stack = new MatrixStack();
    assertEqual(stack.depth(), 1);
    
    stack.push();
    assertEqual(stack.depth(), 2);
    
    stack.getTop().makeTranslation(5, 5, 5);
    stack.pop();
    assertEqual(stack.depth(), 1);
  }
};
