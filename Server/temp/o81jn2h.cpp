#include <iostream>
using namespace std;

int main() {
    int n;

    // Input the value of n
    cout << "Enter a number: ";
    cin >> n;

    // Loop to print natural numbers from 1 to n
    for (int i = 1; i <= n; i++) {
        cout << i << " ";
    }

    cout << endl;  // For new line after printing the numbers
    return 0;
}