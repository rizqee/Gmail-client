import random
#from actions import keccak as keccak
import keccak
## DOMAIN PARAMETERS
DP_a = 0x0000000000000000000000000000000000000000000000000000000000000000
DP_b = 0x0000000000000000000000000000000000000000000000000000000000000007
DP_p = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f
DP_n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141
DP_xG = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
DP_yG = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8

def egcd(a, b):
    x,y, u,v = 0,1, 1,0
    while a != 0:
        q, r = b//a, b%a
        m, n = x-u*q, y-v*q
        b,a, x,y, u,v = a,r, u,v, m,n
    return b, x, y

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        return None  # modular inverse does not exist
    else:
        return x % m


def gradient(x1, y1, x2, y2):
    if x1 == x2 and y1 == y2:
        return ((3 * x1 * x1 + DP_a) * modinv(2 * y1, DP_p))
    else:
        while (x1 - x2) < 0:
            x1 += DP_p
        return ((y1 - y2) * modinv(x1 - x2, DP_p)) 

def ec_addition(x1, y1, x2, y2):
    if x1 == x2 and y1 != y2:
        print("wtf")
        return "origin", "origin" 
    m = gradient(x1, y1, x2, y2)
    x_result = (m * m - x1 - x2) % DP_p
    y_result = (m * (x1 - x_result) - y1) % DP_p
    return x_result, y_result

def ec_multiplication(k, x, y):
    # print("k", k)
    # print("x", x)
    # print("y", y)
    binary_k = bin(k)[2:]
    # ?print("binary_k", binary_k)
    temp_x, temp_y = x, y
    x_result, y_result = "none", "none"
    for i in range(len(binary_k)):
        if x_result != "none":
            x_result, y_result = ec_addition(x_result, y_result, x_result, y_result)
        if binary_k[i] == '1':
            if x_result == "none":
                x_result, y_result = x, y
            else:
                x_result, y_result = ec_addition(x_result, y_result, temp_x, temp_y)    
        # print(i, x_result, y_result)
    return x_result, y_result

def hash_to_integer(hash):
    result = 0
    for i in range(len(hash)):
        result *= 2
        if hash[i] == '1':
            result += 1
    return result

def check_public_key_validity(x, y):
    if x == "origin" or y == "origin":
        return False
    if not isinstance(x, int) or not isinstance(y, int):
        return False
    if not is_on_curve(x, y):
        return False
    return True

def is_on_curve(x, y):
    return (y**2 - (x**3 + DP_a * x + DP_b)) % DP_p == 0

class ecdsa:
    def __init__(self):
        pass

    def generate_key_pair(self):
        valid = False
        d = random.randint(1, DP_n-1)
        while not valid:
            if d == DP_n-1:
                d = 1
            else:
                d += 1
            xQ, yQ = ec_multiplication(d, DP_xG, DP_yG)
            valid = check_public_key_validity(xQ, yQ)
        return xQ, yQ, d

    def generate_signature(self, message, d):
        s = 0
        while s == 0:
            k_inverse = None
            while k_inverse == None:
                r = 0
                while r == 0:
                    k = random.randint(1, DP_n-1)
                    x1, y1 = ec_multiplication(k, DP_xG, DP_yG)
                    print("---this is the---")
                    print(x1, y1)
                    x1 = x1
                    r = x1 % DP_n
                k_inverse = modinv(k, DP_n)
            keccak_class = keccak.Keccak()
            message_hash = keccak_class.hashOutputBinary(message)
            e = hash_to_integer(message_hash) % DP_n
            s = (k_inverse * (e + (d * r))) % DP_n
        return r, s

    def verify_signature(self, message, xQ, yQ, r, s):
        if r < 1 or r >= DP_n or s < 1 or s >= DP_n:
            return False
        keccak_class = keccak.Keccak()
        message_hash = keccak_class.hashOutputBinary(message)
        e = hash_to_integer(message_hash) % DP_n
        w = modinv(s, DP_n)
        u1 = (e * w) % DP_n
        u2 = (r * w) % DP_n
        temp_x1, temp_y1 = ec_multiplication(u1, DP_xG, DP_yG)
        temp_x2, temp_y2 = ec_multiplication(u2, xQ, yQ)
        print(temp_x1, temp_y1, temp_x2, temp_y2)
        xX, yX = ec_addition(temp_x1, temp_y1, temp_x2, temp_y2)
        print("--same with--")
        print(xX, yX)
        if xX == "origin" or yX == "origin":
          return False
        x = xX
        v = x % DP_n
        print(v)
        print(r)
        return v == r



if __name__ == "__main__":
    e = ecdsa()
    message = "Test Message Pls Work Onegai"
    wrong_message = "Test Message Ples Work Onegai"
    xQ, yQ, d = e.generate_key_pair()
    print(xQ, yQ, d)
    r, s = e.generate_signature(message, d)
    print("--r--")
    print(r)
    print("--s--")
    print(s)
    print("--result--")
    print(e.verify_signature(message, xQ, yQ, r, s))

