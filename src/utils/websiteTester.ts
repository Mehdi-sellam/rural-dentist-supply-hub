
import { supabase } from '@/integrations/supabase/client';
import { seedTestData, clearTestData } from './testDataSeeder';

interface TestResult {
  functionality: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: any;
}

export class WebsiteTester {
  private results: TestResult[] = [];

  private addResult(functionality: string, status: 'passed' | 'failed' | 'warning', message: string, details?: any) {
    this.results.push({ functionality, status, message, details });
    console.log(`[${status.toUpperCase()}] ${functionality}: ${message}`, details || '');
  }

  async testAuthentication() {
    console.log('Testing Authentication...');
    
    try {
      // Test session check
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        this.addResult('Authentication', 'failed', `Session check failed: ${error.message}`);
        return;
      }

      if (session?.session?.user) {
        this.addResult('Authentication', 'passed', `User authenticated: ${session.session.user.email}`);
        
        // Test profile fetch
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.session.user.id)
          .single();

        if (profileError) {
          this.addResult('Profile Fetch', 'failed', `Profile fetch failed: ${profileError.message}`);
        } else {
          this.addResult('Profile Fetch', 'passed', `Profile loaded for ${profile.full_name}`, profile);
        }
      } else {
        this.addResult('Authentication', 'warning', 'No user session found - authentication required for full testing');
      }
    } catch (error: any) {
      this.addResult('Authentication', 'failed', `Authentication test failed: ${error.message}`);
    }
  }

  async testDatabaseOperations() {
    console.log('Testing Database Operations...');

    try {
      // Test reading categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        this.addResult('Categories Read', 'failed', `Categories read failed: ${categoriesError.message}`);
      } else {
        this.addResult('Categories Read', 'passed', `Loaded ${categories.length} categories`, categories);
      }

      // Test reading products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) {
        this.addResult('Products Read', 'failed', `Products read failed: ${productsError.message}`);
      } else {
        this.addResult('Products Read', 'passed', `Loaded ${products.length} products`, products);
      }

      // Test reading bundles
      const { data: bundles, error: bundlesError } = await supabase
        .from('bundles')
        .select('*');

      if (bundlesError) {
        this.addResult('Bundles Read', 'failed', `Bundles read failed: ${bundlesError.message}`);
      } else {
        this.addResult('Bundles Read', 'passed', `Loaded ${bundles.length} bundles`, bundles);
      }

    } catch (error: any) {
      this.addResult('Database Operations', 'failed', `Database operations test failed: ${error.message}`);
    }
  }

  async testCartOperations() {
    console.log('Testing Cart Operations...');

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        this.addResult('Cart Operations', 'warning', 'Cannot test cart operations - user not authenticated');
        return;
      }

      const userId = session.session.user.id;

      // Test adding item to cart
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      if (products && products.length > 0) {
        const testProduct = products[0];
        
        const { error: cartError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: testProduct.id,
            quantity: 2
          });

        if (cartError) {
          this.addResult('Cart Add Item', 'failed', `Cart add failed: ${cartError.message}`);
        } else {
          this.addResult('Cart Add Item', 'passed', `Added ${testProduct.name_fr} to cart`);
          
          // Test reading cart
          const { data: cartItems, error: cartReadError } = await supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', userId);

          if (cartReadError) {
            this.addResult('Cart Read', 'failed', `Cart read failed: ${cartReadError.message}`);
          } else {
            this.addResult('Cart Read', 'passed', `Cart has ${cartItems.length} items`, cartItems);
          }
        }
      }

    } catch (error: any) {
      this.addResult('Cart Operations', 'failed', `Cart operations test failed: ${error.message}`);
    }
  }

  async testOrderOperations() {
    console.log('Testing Order Operations...');

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        this.addResult('Order Operations', 'warning', 'Cannot test order operations - user not authenticated');
        return;
      }

      const userId = session.session.user.id;

      // Create a test order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: 15000,
          payment_method: 'cod',
          payment_status: 'pending',
          status: 'pending',
          notes: 'Test order from website testing'
        })
        .select()
        .single();

      if (orderError) {
        this.addResult('Order Creation', 'failed', `Order creation failed: ${orderError.message}`);
      } else {
        this.addResult('Order Creation', 'passed', `Order created with ID: ${orderData.id}`, orderData);

        // Add order items
        const { data: products } = await supabase.from('products').select('*').limit(2);
        
        if (products && products.length > 0) {
          const orderItems = products.map(product => ({
            order_id: orderData.id,
            product_id: product.id,
            product_name: product.name_fr,
            product_price: product.price,
            quantity: 1
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            this.addResult('Order Items', 'failed', `Order items creation failed: ${itemsError.message}`);
          } else {
            this.addResult('Order Items', 'passed', `Added ${orderItems.length} items to order`);
          }
        }

        // Test reading orders
        const { data: orders, error: ordersReadError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', userId);

        if (ordersReadError) {
          this.addResult('Orders Read', 'failed', `Orders read failed: ${ordersReadError.message}`);
        } else {
          this.addResult('Orders Read', 'passed', `User has ${orders.length} orders`, orders);
        }
      }

    } catch (error: any) {
      this.addResult('Order Operations', 'failed', `Order operations test failed: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive website functionality tests...');
    
    try {
      // Clear existing test data
      await clearTestData();
      
      // Seed fresh test data
      await seedTestData();
      
      // Run all tests
      await this.testAuthentication();
      await this.testDatabaseOperations();
      await this.testCartOperations();
      await this.testOrderOperations();

      // Generate report
      this.generateReport();
      
      return this.results;
    } catch (error: any) {
      console.error('Test suite failed:', error);
      this.addResult('Test Suite', 'failed', `Test suite execution failed: ${error.message}`);
      return this.results;
    }
  }

  generateReport() {
    console.log('\n📊 WEBSITE FUNCTIONALITY TEST REPORT');
    console.log('=====================================');
    
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`📝 Total Tests: ${this.results.length}`);
    
    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const icon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
      console.log(`${icon} ${result.functionality}: ${result.message}`);
    });

    if (failed === 0) {
      console.log('\n🎉 All critical functionality tests passed!');
    } else {
      console.log(`\n⚠️  ${failed} tests failed - review the errors above`);
    }
  }

  getResults() {
    return this.results;
  }
}
