import random

#Initial permut made on the key
CP_1 = [57, 49, 41, 33, 25, 17, 9,
        1, 58, 50, 42, 34, 26, 18,
        10, 2, 59, 51, 43, 35, 27,
        19, 11, 3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
        7, 62, 54, 46, 38, 30, 22,
        14, 6, 61, 53, 45, 37, 29,
        21, 13, 5, 28, 20, 12, 4]

#Permut applied on shifted key to get Ki+1
CP_2 = [14, 17, 11, 24, 1, 5, 3, 28,
        15, 6, 21, 10, 23, 19, 12, 4,
        26, 8, 16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55, 30, 40,
        51, 45, 33, 48, 44, 49, 39, 56,
        34, 53, 46, 42, 50, 36, 29, 32]

#Expand matrix to get a 48bits matrix of datas to apply the xor with Ki
E = [32, 1, 2, 3, 4, 5,
     4, 5, 6, 7, 8, 9,
     8, 9, 10, 11, 12, 13,
     12, 13, 14, 15, 16, 17,
     16, 17, 18, 19, 20, 21,
     20, 21, 22, 23, 24, 25,
     24, 25, 26, 27, 28, 29,
     28, 29, 30, 31, 32, 1]

#SBOX
S_BOX = [
         
[[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
 [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
 [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
 [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
],

[[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
 [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
 [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
 [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
],

[[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
 [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
 [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
 [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
],

[[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
 [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
 [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
 [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
],  

[[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
 [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
 [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
 [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
], 

[[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
 [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
 [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
 [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
], 

[[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
 [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
 [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
 [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
],
   
[[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
 [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
 [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
 [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
]
]


def string_to_bit_array(text):#Convert a string into a list of bits
    array = list()
    for char in text:
        binval = binvalue(char, 8)#Get the char value on one byte
        array.extend([int(x) for x in list(binval)]) #Add the bits to the final list
    return array

def bit_array_to_string(array): #Recreate the string from the bit array
    res = ''.join([chr(int(y,2)) for y in [''.join([str(x) for x in _bytes]) for _bytes in  nsplit(array,8)]])   
    return res

def binvalue(val, bitsize): #Return the binary value as a string of the given size 
    binval = bin(val)[2:] if isinstance(val, int) else bin(ord(val))[2:]
    if len(binval) > bitsize:
        raise "binary value larger than the expected size"
    while len(binval) < bitsize:
        binval = "0"+binval #Add as many 0 as needed to get the wanted size
    return binval

def nsplit(s, n):#Split a list into sublists of size "n"
    return [s[k:k+n] for k in range(0, len(s), n)]

def odd_even_split(list):
    list_1 = []
    list_2 = []
    for i in range(len(list)):
        if i % 2 == 0:
            list_1.append(list[i])
        else:
            list_2.append(list[i])
    return list_1, list_2

def odd_even_combine(list_1, list_2):
    list = []
    for i in range(len(list_1)):
        list.append(list_1[i])
        list.append(list_2[i])
    return list

def add_bit_array(list_1, list_2):
    list_3 = []
    for i in reversed(range(len(list_1))):
        if list_1[i] + list_2[i] == 0:
            list_3.append(0)
        elif list_1[i] + list_2[i] == 1:
            list_3.append(1)
        elif list_1[i] + list_2[i] == 2:
            list_3.append(0)
            if (i > 0):
                list_1[i-1] += 1
        elif list_1[i] + list_2[i] == 3:
            list_3.append(1)
            if (i > 0):
                list_1[i-1] += 1
    
    list_3.reverse()
    return list_3

ENCRYPT=1
DECRYPT=0

ECB = 0
CBC = 1
COUNTER = 2

def get_seed(password):
    seed = 0
    for c in password:
        seed += ord(c)
        print(ord(c))
    print(seed)
    return seed

def get_shift(i):
    if i % 2 == 0:
        return 1
    else:
        return 2

def get_IV(seed):
    random.seed(seed)
    result = []
    for i in range(64):
        result.append(random.randint(0,1))
    return result

def get_starting_counter(seed):
    random.seed(seed)
    result = []
    for i in range(64):
        result.append(random.randint(0,1))
    return result

def increment_bit_list(list):
    for i in reversed(range(64)):
        if list[i] == 0:
             list[i] = 1
             break
        else:
            list[i] = 0
    return list

    

class traveler():
    def __init__(self):
        self.password = None
        self.text = None
        self.keys = list()
        self.seed = None
        self.num_of_loop = 0
        self.num_of_keys = 0
        self.p_mat = []
        self.p_mat_inverse = []
        
    def run(self, key, text, action=ENCRYPT, padding=False, mode=ECB):
        # if len(key) < 8:
        #     raise "Key Should be 8 bytes long"
        # elif len(key) > 8:
        #     key = key[:8] # If key size is above 8bytes, cut to be 8bytes long
        while (len(key) % 8) != 0:
            key = key + '\0'

        self.password = key
        self.text = text
        self.seed = get_seed(self.password)
        random.seed(self.seed)
        self.num_of_loop = random.randint(8, 12)
        print("num of loop " , self.num_of_loop)
        
        if padding and action==ENCRYPT:
            self.addPadding()
        elif len(self.text) % 8 != 0: # If not padding specified data size must be multiple of 8 bytes
            raise "Data size should be multiple of 8"
        
        self.generatekeys() #Generate all the keys
        self.generatepmat()
        print("Mat P")
        print(self.p_mat)
        print("Mat P Inverse")
        print(self.p_mat_inverse)

        self.num_of_keys = len(self.password) // 8
        text_blocks = nsplit(self.text, 8) #Split the text in blocks of 8 bytes so 64 bits
        result = list()
        prev_block_for_cbc = get_IV(self.seed)
        counter = get_starting_counter(self.seed)
        key_counter = 0
        for block in text_blocks:#Loop over all the blocks of data
            block = string_to_bit_array(block) #Convert the block in bit array
            
            # FOR CBC
            if mode == CBC and action == ENCRYPT:
                block = self.xor(block, prev_block_for_cbc)
            elif mode == CBC and action == DECRYPT:
                temp_prev_block_for_cbc = block
            # END FOR CBC

            # FOR COUNTER
            if mode == COUNTER:
                temp_block = block
                block = counter
                counter = increment_bit_list(counter)
            # END FOR COUNTER
            
            block = self.permut(block, self.p_mat)#Apply the initial permutation
            g, d = odd_even_split(block) #g(LEFT), d(RIGHT)
            tmp = None
            for i in range(self.num_of_loop): #Do the 16 rounds
                d_e = self.expand(d, E) #Expand d to match Ki size (48bits)
                if action == ENCRYPT or mode == COUNTER:
                    tmp = self.super_encryption(self.keys[key_counter][i], d_e) #If encrypt use Ki
                else:
                    tmp = self.super_encryption(self.keys[key_counter][(self.num_of_loop-1)-i], d_e) #If decrypt start by the last key
                tmp = self.substitute(tmp) #Method that will apply the SBOXes
                tmp = self.xor(g, tmp)
                g = d
                d = tmp
            
            result_block = self.permut(odd_even_combine(d,g), self.p_mat_inverse) #Do the last permut and append the result to result
            
            # FOR CBC
            if mode == CBC and action == DECRYPT:
                result_block = self.xor(result_block, prev_block_for_cbc)
                prev_block_for_cbc = temp_prev_block_for_cbc
            elif mode == CBC and action == ENCRYPT:
                prev_block_for_cbc = result_block
            # END FOR CBC

            # FOR COUNTER
            if mode == COUNTER:
                result_block = self.xor(temp_block, result_block)
            # END FOR COUNTER

            result += result_block
            key_counter += 1
            if key_counter == self.num_of_keys:
                key_counter = 0
        final_res = bit_array_to_string(result)
        if padding and action==DECRYPT:
            return self.removePadding(final_res) #Remove the padding if decrypt and padding is true
        else:
            return final_res #Return the final string of data ciphered/deciphered

    def super_encryption(self, key, plain):
        l, r = odd_even_split(plain)
        transpositioned_plain = l + r
        return add_bit_array(transpositioned_plain, key)

    def generatepmat(self):
        self.p_mat = []
        self.p_mat_inverse = [0] * 64
        random.seed(self.seed)
        for i in range(64):
            rand_int = random.randint(1, 64)
            while rand_int in self.p_mat:
                rand_int += 1
                if rand_int == 65:
                    rand_int = 1
            self.p_mat.append(rand_int)
            self.p_mat_inverse[rand_int-1] = i+1

    
    def substitute(self, d_e):#Substitute bytes using SBOX
        subblocks = nsplit(d_e, 6)#Split bit array into sublist of 6 bits
        result = list()
        for i in range(len(subblocks)): #For all the sublists
            block = subblocks[i]
            row = int(str(block[0])+str(block[5]),2) #Get the row with the first and last bit
            column = int(''.join([str(x) for x in block[1:][:-1]]),2) #Column is the 2,3,4,5th bits
            val = S_BOX[i][row][column] #Take the value in the SBOX appropriated for the round (i)
            bin = binvalue(val, 4) #Convert the value to binary
            result += [int(x) for x in bin] #And append it to the resulting list
        return result

    def permut(self, block, table): #Permut the given block using the given table (so generic method)
        return [block[x-1] for x in table]
    
    def expand(self, block, table):#Do the exact same thing than permut but for more clarity has been renamed
        return [block[x-1] for x in table]
    
    def xor(self, t1, t2):#Apply a xor and return the resulting list
        return [x^y for x,y in zip(t1,t2)]
    
    def generatekeys(self):#Algorithm that generates all the keys
        self.keys = []
        for i in range(len(self.password) // 8):
            cur_keys = []
            key = string_to_bit_array(self.password[i*8:(i+1)*8])
            key = self.permut(key, CP_1) #Apply the initial permut on the key
            key = key[:56]
            g, d = odd_even_split(key) #Split it in to (g->LEFT),(d->RIGHT)
            for j in range(self.num_of_loop):#Apply the 16 rounds
                if j % 2 == 0:
                    g, d = self.shift(g, d, j) #Apply the shift associated with the round (not always 1)
                else:
                    g, d = self.shift_right(g, d, j)
                tmp = odd_even_combine(g, d) #Merge them
                cur_keys.append(self.permut(tmp, CP_2)) #Apply the permut to get the Ki
            self.keys.append(cur_keys)

    def shift(self, g, d, n): #Shift a list of the given value
        return g[n:] + g[:n], d[n:] + d[:n]

    def shift_right(self, g, d, n):
        return g[len(g)-n:] + g[:len(g)-n], d[len(d)-n:] + d[:len(d)-n]

    def addPadding(self):#Add padding to the datas using PKCS5 spec.
        pad_len = 8 - (len(self.text) % 8)
        self.text += pad_len * chr(pad_len)
    
    def removePadding(self, data):#Remove the padding of the plain text (it assume there is padding)
        pad_len = ord(data[-1])
        return data[:-pad_len]
    
    def encrypt(self, key, text, padding=False, mode=ECB):
        return self.run(key, text, ENCRYPT, padding, mode)
    
    def decrypt(self, key, text, padding=False, mode=ECB):
        return self.run(key, text, DECRYPT, padding, mode)
    
if __name__ == '__main__':
    key = "IniKunci"
    text= "Peter Piper picked a peck of pickled peppers \
A peck of pickled peppers Peter Piper picked \
If Peter Piper picked a peck of pickled peppers \
Where's the peck of pickled peppers Peter Piper picked"
    t = traveler()
    r = t.encrypt(key,text, padding=True, mode=CBC)
    r2 = t.decrypt(key,r, padding=True, mode=CBC)
    print("Ciphered: ")
    for c in r:
        print(ord(c), end=' ')
    print()
    print("Ciphered (Hex): ")
    for c in r:
        hx = hex(ord(c))[2:]
        while len(hx) < 2:
           hx = '0' + hx
        print(hx, end='')  
    print("Deciphered: %s" % r2)