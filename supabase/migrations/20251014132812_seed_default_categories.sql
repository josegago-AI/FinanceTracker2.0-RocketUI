/*
  # Seed Default Categories

  ## Overview
  Creates a function to insert default categories when a user signs up.
  This provides a great starting point for new users without requiring manual category setup.

  ## Default Categories

  ### Income Categories
  - Salary
  - Freelance
  - Investments
  - Other Income

  ### Expense Categories
  - Food & Dining
  - Transportation
  - Housing
  - Utilities
  - Healthcare
  - Entertainment
  - Shopping
  - Personal Care
  - Education
  - Travel
  - Bills & Fees
  - Other Expenses

  ## Implementation

  - Function to create default categories for a user
  - Trigger to automatically call this function after profile creation
*/

-- Create function to insert default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS trigger AS $$
BEGIN
  -- Insert default income categories
  INSERT INTO public.categories (user_id, name, type, color, icon) VALUES
    (NEW.id, 'Salary', 'income', '#10b981', 'banknote'),
    (NEW.id, 'Freelance', 'income', '#3b82f6', 'briefcase'),
    (NEW.id, 'Investments', 'income', '#8b5cf6', 'trending-up'),
    (NEW.id, 'Other Income', 'income', '#6b7280', 'plus-circle');

  -- Insert default expense categories
  INSERT INTO public.categories (user_id, name, type, color, icon) VALUES
    (NEW.id, 'Food & Dining', 'expense', '#ef4444', 'utensils'),
    (NEW.id, 'Transportation', 'expense', '#f59e0b', 'car'),
    (NEW.id, 'Housing', 'expense', '#14b8a6', 'home'),
    (NEW.id, 'Utilities', 'expense', '#06b6d4', 'zap'),
    (NEW.id, 'Healthcare', 'expense', '#ec4899', 'heart'),
    (NEW.id, 'Entertainment', 'expense', '#a855f7', 'film'),
    (NEW.id, 'Shopping', 'expense', '#f97316', 'shopping-bag'),
    (NEW.id, 'Personal Care', 'expense', '#84cc16', 'user'),
    (NEW.id, 'Education', 'expense', '#0ea5e9', 'book'),
    (NEW.id, 'Travel', 'expense', '#06b6d4', 'plane'),
    (NEW.id, 'Bills & Fees', 'expense', '#64748b', 'file-text'),
    (NEW.id, 'Other Expenses', 'expense', '#6b7280', 'minus-circle');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create default categories after profile creation
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_categories();
